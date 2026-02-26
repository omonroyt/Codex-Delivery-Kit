import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["APP_ENV"] = "test"

from fastapi.testclient import TestClient
from app.database import Base, engine
from app.main import app


client = TestClient(app)


def test_health():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
