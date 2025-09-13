import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.resource import SharedResource
from uuid import uuid4

client = TestClient(app)

def test_create_resource():
    # First register a user
    register_response = client.post("/auth/register", json={
        "username": "testuser3",
        "email": "test3@example.com",
        "password": "testpassword123"
    })
    
    # Then login
    login_response = client.post("/auth/login", json={
        "username": "testuser3",
        "password": "testpassword123"
    })
    
    # Create resource
    token = login_response.json()["access_token"]
    response = client.post("/resources", 
        json={
            "title": "Test Resource",
            "description": "A test resource for sharing",
            "resource_type": "link"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Resource"
    assert "id" in data

def test_get_resources():
    response = client.get("/resources")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
