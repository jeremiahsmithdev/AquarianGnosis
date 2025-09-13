from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.resource import SharedResource as SharedResourceModel
from app.models.user import User
from app.schemas.resource import SharedResourceCreate, SharedResourceUpdate, SharedResource
from app.api.auth import get_current_user
from typing import List
from uuid import UUID

router = APIRouter()

# Shared Resource endpoints
@router.get("/resources", response_model=List[SharedResource])
def get_resources(db: Session = Depends(get_db)):
    resources = db.query(SharedResourceModel).all()
    return resources

@router.post("/resources", response_model=SharedResource)
def create_resource(
    resource: SharedResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_resource = SharedResourceModel(
        title=resource.title,
        url=resource.url,
        description=resource.description,
        resource_type=resource.resource_type,
        submitted_by=current_user.id
    )
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.get("/resources/{resource_id}", response_model=SharedResource)
def get_resource(resource_id: UUID, db: Session = Depends(get_db)):
    resource = db.query(SharedResourceModel).filter(SharedResourceModel.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.put("/resources/{resource_id}", response_model=SharedResource)
def update_resource(
    resource_id: UUID,
    resource: SharedResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_resource = db.query(SharedResourceModel).filter(SharedResourceModel.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Check if user is submitter or has permission to edit
    if db_resource.submitted_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this resource")
    
    for key, value in resource.dict(exclude_unset=True).items():
        setattr(db_resource, key, value)
    
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.delete("/resources/{resource_id}")
def delete_resource(
    resource_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_resource = db.query(SharedResourceModel).filter(SharedResourceModel.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    # Check if user is submitter or has permission to delete
    if db_resource.submitted_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")
    
    db.delete(db_resource)
    db.commit()
    return {"message": "Resource deleted successfully"}

# Voting endpoints
@router.post("/resources/{resource_id}/vote")
def vote_resource(
    resource_id: UUID,
    vote_type: str,  # "up" or "down"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_resource = db.query(SharedResourceModel).filter(SharedResourceModel.id == resource_id).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    if vote_type == "up":
        db_resource.upvotes += 1
    elif vote_type == "down":
        db_resource.downvotes += 1
    else:
        raise HTTPException(status_code=400, detail="Invalid vote type. Use 'up' or 'down'")
    
    db.commit()
    db.refresh(db_resource)
    return {"message": "Vote recorded successfully", "upvotes": db_resource.upvotes, "downvotes": db_resource.downvotes}
