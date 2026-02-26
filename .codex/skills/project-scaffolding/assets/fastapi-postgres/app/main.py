from datetime import timedelta, datetime
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .deps import get_current_user, require_role
from .models import Message, Payment, RefreshToken, User
from .schemas import LoginRequest, MessageRequest, PaymentRequest, RefreshRequest, RegisterRequest
from .security import create_token, hash_password, hash_token, verify_password

app = FastAPI(title="fastapi-postgres-api", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "fastapi-postgres-api"}


@app.post("/auth/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="email_already_exists")
    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role="user",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"user": {"id": user.id, "email": user.email, "role": user.role}}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid_credentials")

    access_token = create_token(
      user_id=user.id,
      role=user.role,
      token_type="access",
      expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    refresh_token = create_token(
      user_id=user.id,
      role=user.role,
      token_type="refresh",
      expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(
        RefreshToken(
            token_hash=hash_token(refresh_token),
            user_id=user.id,
            expires_at=datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    db.commit()
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"id": user.id, "email": user.email, "role": user.role},
    }


@app.post("/auth/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    try:
        data = jwt.decode(payload.refresh_token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="invalid_refresh_token") from exc

    if data.get("token_type") != "refresh":
        raise HTTPException(status_code=401, detail="invalid_token_type")

    token_hash = hash_token(payload.refresh_token)
    stored = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if not stored or stored.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="refresh_token_expired_or_revoked")

    access_token = create_token(
      user_id=int(data["sub"]),
      role=data["role"],
      token_type="access",
      expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return {"access_token": access_token}


@app.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"user": {"id": user.id, "email": user.email, "role": user.role, "name": user.name}}


@app.get("/admin/users")
def admin_users(
    _: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    users = db.query(User).all()
    return {
        "users": [
            {"id": user.id, "email": user.email, "role": user.role, "created_at": user.created_at.isoformat()}
            for user in users
        ]
    }


@app.post("/payments/checkout")
def checkout(
    payload: PaymentRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    payment = Payment(
        user_id=user.id,
        amount=payload.amount,
        currency=payload.currency,
        provider=payload.provider,
        status="PENDING",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return {"payment_id": payment.id, "status": payment.status, "next_action": "connect_real_payment_provider"}


@app.post("/messages/send")
def send_message(
    payload: MessageRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = Message(
        sender_id=user.id,
        channel=payload.channel,
        payload=payload.payload,
        status="QUEUED",
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return {"message_id": message.id, "status": message.status, "next_action": "connect_queue_or_provider"}
