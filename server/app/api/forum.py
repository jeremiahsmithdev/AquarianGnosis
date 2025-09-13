from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.forum import ForumCategory as ForumCategoryModel, ForumThread as ForumThreadModel, ForumReply as ForumReplyModel
from app.models.user import User
from app.schemas.forum import ForumCategoryCreate, ForumCategoryUpdate, ForumThreadCreate, ForumThreadUpdate, ForumReplyCreate, ForumReplyUpdate, ForumCategory, ForumThread, ForumReply
from app.api.auth import get_current_user
from typing import List
from uuid import UUID

router = APIRouter()

# Forum Category endpoints
@router.get("/categories", response_model=List[ForumCategory])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(ForumCategoryModel).all()
    return categories

@router.post("/categories", response_model=ForumCategory)
def create_category(
    category: ForumCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = ForumCategoryModel(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.put("/categories/{category_id}", response_model=ForumCategory)
def update_category(
    category_id: UUID,
    category: ForumCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(ForumCategoryModel).filter(ForumCategoryModel.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for key, value in category.dict(exclude_unset=True).items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_category = db.query(ForumCategoryModel).filter(ForumCategoryModel.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

# Forum Thread endpoints
@router.get("/categories/{category_id}/threads", response_model=List[ForumThread])
def get_threads_by_category(category_id: UUID, db: Session = Depends(get_db)):
    threads = db.query(ForumThreadModel).filter(ForumThreadModel.category_id == category_id).all()
    return threads

@router.post("/threads", response_model=ForumThread)
def create_thread(
    thread: ForumThreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify category exists
    db_category = db.query(ForumCategoryModel).filter(ForumCategoryModel.id == thread.category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_thread = ForumThreadModel(
        title=thread.title,
        content=thread.content,
        category_id=thread.category_id,
        author_id=current_user.id,
        is_pinned=thread.is_pinned
    )
    db.add(db_thread)
    db.commit()
    db.refresh(db_thread)
    return db_thread

@router.get("/threads/{thread_id}", response_model=ForumThread)
def get_thread(thread_id: UUID, db: Session = Depends(get_db)):
    thread = db.query(ForumThreadModel).filter(ForumThreadModel.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread

@router.put("/threads/{thread_id}", response_model=ForumThread)
def update_thread(
    thread_id: UUID,
    thread: ForumThreadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_thread = db.query(ForumThreadModel).filter(ForumThreadModel.id == thread_id).first()
    if not db_thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    # Check if user is author or has permission to edit
    if db_thread.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this thread")
    
    for key, value in thread.dict(exclude_unset=True).items():
        setattr(db_thread, key, value)
    
    db.commit()
    db.refresh(db_thread)
    return db_thread

@router.delete("/threads/{thread_id}")
def delete_thread(
    thread_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_thread = db.query(ForumThreadModel).filter(ForumThreadModel.id == thread_id).first()
    if not db_thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    # Check if user is author or has permission to delete
    if db_thread.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this thread")
    
    db.delete(db_thread)
    db.commit()
    return {"message": "Thread deleted successfully"}

# Forum Reply endpoints
@router.get("/threads/{thread_id}/replies", response_model=List[ForumReply])
def get_replies_by_thread(thread_id: UUID, db: Session = Depends(get_db)):
    replies = db.query(ForumReplyModel).filter(ForumReplyModel.thread_id == thread_id).all()
    return replies

@router.post("/replies", response_model=ForumReply)
def create_reply(
    reply: ForumReplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify thread exists
    db_thread = db.query(ForumThreadModel).filter(ForumThreadModel.id == reply.thread_id).first()
    if not db_thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    # Verify parent reply exists if provided
    if reply.parent_reply_id:
        db_parent_reply = db.query(ForumReplyModel).filter(ForumReplyModel.id == reply.parent_reply_id).first()
        if not db_parent_reply:
            raise HTTPException(status_code=404, detail="Parent reply not found")
    
    db_reply = ForumReplyModel(
        content=reply.content,
        thread_id=reply.thread_id,
        author_id=current_user.id,
        parent_reply_id=reply.parent_reply_id
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    return db_reply

@router.put("/replies/{reply_id}", response_model=ForumReply)
def update_reply(
    reply_id: UUID,
    reply: ForumReplyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reply = db.query(ForumReplyModel).filter(ForumReplyModel.id == reply_id).first()
    if not db_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    # Check if user is author or has permission to edit
    if db_reply.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this reply")
    
    for key, value in reply.dict(exclude_unset=True).items():
        setattr(db_reply, key, value)
    
    db.commit()
    db.refresh(db_reply)
    return db_reply

@router.delete("/replies/{reply_id}")
def delete_reply(
    reply_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reply = db.query(ForumReplyModel).filter(ForumReplyModel.id == reply_id).first()
    if not db_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    # Check if user is author or has permission to delete
    if db_reply.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this reply")
    
    db.delete(db_reply)
    db.commit()
    return {"message": "Reply deleted successfully"}

# Voting endpoints
@router.post("/threads/{thread_id}/vote")
def vote_thread(
    thread_id: UUID,
    vote_type: str,  # "up" or "down"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_thread = db.query(ForumThreadModel).filter(ForumThreadModel.id == thread_id).first()
    if not db_thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    if vote_type == "up":
        db_thread.upvotes += 1
    elif vote_type == "down":
        db_thread.downvotes += 1
    else:
        raise HTTPException(status_code=400, detail="Invalid vote type. Use 'up' or 'down'")
    
    db.commit()
    db.refresh(db_thread)
    return {"message": "Vote recorded successfully", "upvotes": db_thread.upvotes, "downvotes": db_thread.downvotes}

@router.post("/replies/{reply_id}/vote")
def vote_reply(
    reply_id: UUID,
    vote_type: str,  # "up" or "down"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_reply = db.query(ForumReplyModel).filter(ForumReplyModel.id == reply_id).first()
    if not db_reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    if vote_type == "up":
        db_reply.upvotes += 1
    elif vote_type == "down":
        db_reply.downvotes += 1
    else:
        raise HTTPException(status_code=400, detail="Invalid vote type. Use 'up' or 'down'")
    
    db.commit()
    db.refresh(db_reply)
    return {"message": "Vote recorded successfully", "upvotes": db_reply.upvotes, "downvotes": db_reply.downvotes}
