from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.study_group import StudyGroup as StudyGroupModel, StudyGroupMember as StudyGroupMemberModel
from app.models.user import User
from app.schemas.study_group import StudyGroupCreate, StudyGroupUpdate, StudyGroupMemberCreate, StudyGroupMemberUpdate, StudyGroup, StudyGroupMember
from app.api.auth import get_current_user
from typing import List
from uuid import UUID

router = APIRouter()

# Study Group endpoints
@router.get("/study-groups", response_model=List[StudyGroup])
def get_study_groups(db: Session = Depends(get_db)):
    groups = db.query(StudyGroupModel).all()
    return groups

@router.post("/study-groups", response_model=StudyGroup)
def create_study_group(
    group: StudyGroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = StudyGroupModel(
        name=group.name,
        description=group.description,
        creator_id=current_user.id,
        is_location_based=group.is_location_based,
        max_members=group.max_members,
        is_public=group.is_public
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    # Automatically add creator as admin member
    db_member = StudyGroupMemberModel(
        group_id=db_group.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(db_member)
    db.commit()
    
    return db_group

@router.get("/study-groups/{group_id}", response_model=StudyGroup)
def get_study_group(group_id: UUID, db: Session = Depends(get_db)):
    group = db.query(StudyGroupModel).filter(StudyGroupModel.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Study group not found")
    return group

@router.put("/study-groups/{group_id}", response_model=StudyGroup)
def update_study_group(
    group_id: UUID,
    group: StudyGroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = db.query(StudyGroupModel).filter(StudyGroupModel.id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Study group not found")
    
    # Check if user is creator or admin
    member = db.query(StudyGroupMemberModel).filter(
        StudyGroupMemberModel.group_id == group_id,
        StudyGroupMemberModel.user_id == current_user.id
    ).first()
    
    if not member or member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this study group")
    
    for key, value in group.dict(exclude_unset=True).items():
        setattr(db_group, key, value)
    
    db.commit()
    db.refresh(db_group)
    return db_group

@router.delete("/study-groups/{group_id}")
def delete_study_group(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_group = db.query(StudyGroupModel).filter(StudyGroupModel.id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Study group not found")
    
    # Check if user is creator
    if db_group.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this study group")
    
    db.delete(db_group)
    db.commit()
    return {"message": "Study group deleted successfully"}

# Study Group Member endpoints
@router.get("/study-groups/{group_id}/members", response_model=List[StudyGroupMember])
def get_study_group_members(group_id: UUID, db: Session = Depends(get_db)):
    members = db.query(StudyGroupMemberModel).filter(StudyGroupMemberModel.group_id == group_id).all()
    return members

@router.post("/study-groups/{group_id}/join", response_model=StudyGroupMember)
def join_study_group(
    group_id: UUID,
    member: StudyGroupMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify group exists
    db_group = db.query(StudyGroupModel).filter(StudyGroupModel.id == group_id).first()
    if not db_group:
        raise HTTPException(status_code=404, detail="Study group not found")
    
    # Check if user is already a member
    existing_member = db.query(StudyGroupMemberModel).filter(
        StudyGroupMemberModel.group_id == group_id,
        StudyGroupMemberModel.user_id == current_user.id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="Already a member of this study group")
    
    # Check if group is full
    member_count = db.query(StudyGroupMemberModel).filter(StudyGroupMemberModel.group_id == group_id).count()
    if member_count >= db_group.max_members:
        raise HTTPException(status_code=400, detail="Study group is full")
    
    db_member = StudyGroupMemberModel(
        group_id=group_id,
        user_id=current_user.id,
        role="member"
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.put("/study-groups/{group_id}/members/{member_id}", response_model=StudyGroupMember)
def update_study_group_member(
    group_id: UUID,
    member_id: UUID,
    member: StudyGroupMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_member = db.query(StudyGroupMemberModel).filter(StudyGroupMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Check if user is admin or moderator
    current_member = db.query(StudyGroupMemberModel).filter(
        StudyGroupMemberModel.group_id == group_id,
        StudyGroupMemberModel.user_id == current_user.id
    ).first()
    
    if not current_member or current_member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized to update member roles")
    
    # Prevent users from changing their own role to admin
    if db_member.user_id == current_user.id and member.role == "admin":
        raise HTTPException(status_code=403, detail="Cannot change your own role to admin")
    
    for key, value in member.dict(exclude_unset=True).items():
        setattr(db_member, key, value)
    
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/study-groups/{group_id}/members/{member_id}")
def remove_study_group_member(
    group_id: UUID,
    member_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_member = db.query(StudyGroupMemberModel).filter(StudyGroupMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Check if user is admin or moderator, or if they're removing themselves
    current_member = db.query(StudyGroupMemberModel).filter(
        StudyGroupMemberModel.group_id == group_id,
        StudyGroupMemberModel.user_id == current_user.id
    ).first()
    
    if not current_member:
        raise HTTPException(status_code=403, detail="Not a member of this study group")
    
    if current_member.id != member_id and current_member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Not authorized to remove other members")
    
    db.delete(db_member)
    db.commit()
    return {"message": "Member removed successfully"}
