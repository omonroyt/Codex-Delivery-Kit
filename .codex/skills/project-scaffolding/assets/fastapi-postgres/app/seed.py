import os
from sqlalchemy.orm import Session
from .database import SessionLocal, Base, engine
from .models import User
from .security import hash_password


def run_seed():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        email = os.getenv("SEED_ADMIN_EMAIL", "admin@example.com").lower()
        password = os.getenv("SEED_ADMIN_PASSWORD", "admin123456")
        exists = db.query(User).filter(User.email == email).first()
        if exists:
            print("[seed] admin already exists")
            return
        user = User(email=email, password_hash=hash_password(password), role="admin", name="Admin")
        db.add(user)
        db.commit()
        print("[seed] admin created")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()

