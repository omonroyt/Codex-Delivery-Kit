from datetime import datetime, timedelta
from hashlib import sha256
from jose import jwt
from passlib.context import CryptContext
from .config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def hash_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def create_token(user_id: int, role: str, token_type: str, expires_delta: timedelta) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "token_type": token_type,
        "exp": datetime.utcnow() + expires_delta,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")

