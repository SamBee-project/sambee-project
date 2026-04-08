import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import uuid


@pytest.mark.asyncio
async def test_register_user():
    random_email = f"test_{uuid.uuid4().hex[:6]}@example.com"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        response = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": random_email,
                "password": "very_strong_password_123"
            },
        )

    assert response.status_code == 201


@pytest.mark.asyncio
async def test_login_user():
    email = f"login_{uuid.uuid4().hex[:6]}@example.com"
    password = "password123"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        await ac.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password}
        )

        response = await ac.post(
            "/api/v1/auth/jwt/login",
            data={"username": email, "password": password}
        )

    assert response.status_code == 200
