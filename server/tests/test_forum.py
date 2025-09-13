import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.forum import ForumCategory, ForumThread, ForumReply
from uuid import uuid4

client = TestClient(app)

def test_create_category():
    # First register a user
    register_response = client.post("/auth/register", json={
        "username": "testuser2",
        "email": "test2@example.com",
        "password": "testpassword123"
    })
    
    # Then login
    login_response = client.post("/auth/login", json={
        "username": "testuser2",
        "password": "testpassword123"
    })
    
    # Create category
    token = login_response.json()["access_token"]
    response = client.post("/forum/categories", 
        json={
            "name": "Test Category",
            "description": "A test category for forum posts"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"
    assert "id" in data

def test_get_categories():
    response = client.get("/forum/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
