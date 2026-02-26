from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class PaymentRequest(BaseModel):
    amount: int
    currency: str = "USD"
    provider: str = "mock"


class MessageRequest(BaseModel):
    payload: str
    channel: str = "in_app"

