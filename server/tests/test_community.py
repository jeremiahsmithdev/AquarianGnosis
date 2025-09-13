import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.models.forum import ForumCategory, ForumThread, ForumReply
from app.models.study_group import StudyGroup, StudyGroupMember
from app.models.resource import SharedResource
from sqlalchemy.orm import Session
from uuid import uuid4

client = TestClient(app)

# Test forum functionality
def test_create_category():
    response = client.post("/forum/categories", json={
        "name": "Test Category",
        "description": "A test category for forum posts"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"
    assert "id" in data

def test_get_categories():
    response = client.get("/forum/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# Test study group functionality
def test_create_study_group():
    response = client.post("/study-groups", json={
        "name": "Test Study Group",
        "description": "A test study group for gnostic studies"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Study Group"
    assert "id" in data

def test_get_study_groups():
    response = client.get("/study-groups")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# Test resource sharing functionality
def test_create_resource():
    response = client.post("/resources", json={
        "title": "Test Resource",
        "description": "A test resource for sharing",
        "resource_type": "link"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Resource"
    assert "id" in data

def test_get_resources():
    response = client.get("/resources")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
