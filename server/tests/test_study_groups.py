import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.study_group import StudyGroup, StudyGroupMember
from uuid import uuid4

client = TestClient(app)

def test_create_study_group():
    # First register a user
    register_response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123"
    })
    
    # Then login
    login_response = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpassword123"
    })
    
    # Create study group
    token = login_response.json()["access_token"]
    response = client.post("/study-groups", 
        json={
            "name": "Test Study Group",
            "description": "A test study group for gnostic studies"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Study Group"
    assert "id" in data

def test_get_study_groups():
    response = client.get("/study-groups")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
