import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["APP_ENV"] = "test"

from fastapi.testclient import TestClient
from app.database import Base, engine
from app.main import app


client = TestClient(app)


def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_register_login_refresh_me_flow():
    reset_db()

    register = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "strongpass123",
            "name": "Test",
        },
    )
    assert register.status_code == 200

    login = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "strongpass123",
        },
    )
    assert login.status_code == 200
    body = login.json()
    assert body["access_token"]
    assert body["refresh_token"]

    refresh = client.post(
        "/auth/refresh",
        json={"refresh_token": body["refresh_token"]},
    )
    assert refresh.status_code == 200
    assert refresh.json()["access_token"]

    me = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert me.status_code == 200
    assert me.json()["user"]["email"] == "test@example.com"
