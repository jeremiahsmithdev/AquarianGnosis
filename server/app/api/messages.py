from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from uuid import UUID
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User, Message
from app.schemas.user import MessageCreate, Message as MessageSchema

messages_router = APIRouter()

@messages_router.post("/", response_model=MessageSchema)
async def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to another user"""
    # Check if recipient exists
    recipient = db.query(User).filter(User.id == message_data.recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Check if trying to send message to self
    if message_data.recipient_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself"
        )
    
    # Create message
    db_message = Message(
        sender_id=current_user.id,
        recipient_id=message_data.recipient_id,
        content=message_data.content
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message

@messages_router.get("/", response_model=List[MessageSchema])
async def get_messages(
    conversation_with: Optional[UUID] = Query(None, description="Get conversation with specific user"),
    limit: int = Query(50, description="Number of messages to retrieve"),
    offset: int = Query(0, description="Offset for pagination"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages for current user"""
    query = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.recipient_id == current_user.id
        )
    )
    
    if conversation_with:
        # Get conversation with specific user
        query = query.filter(
            or_(
                and_(Message.sender_id == current_user.id, Message.recipient_id == conversation_with),
                and_(Message.sender_id == conversation_with, Message.recipient_id == current_user.id)
            )
        )
    
    messages = query.order_by(Message.created_at.desc()).offset(offset).limit(limit).all()
    return messages

@messages_router.get("/conversations")
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of conversations (unique users the current user has messaged with)"""
    # Get all unique users that have had conversations with current user
    sent_to = db.query(Message.recipient_id).filter(Message.sender_id == current_user.id).distinct()
    received_from = db.query(Message.sender_id).filter(Message.recipient_id == current_user.id).distinct()
    
    # Combine and get unique user IDs
    conversation_user_ids = set()
    for result in sent_to:
        conversation_user_ids.add(result[0])
    for result in received_from:
        conversation_user_ids.add(result[0])
    
    # Get user details for each conversation
    conversations = []
    for user_id in conversation_user_ids:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            # Get latest message in conversation
            latest_message = db.query(Message).filter(
                or_(
                    and_(Message.sender_id == current_user.id, Message.recipient_id == user_id),
                    and_(Message.sender_id == user_id, Message.recipient_id == current_user.id)
                )
            ).order_by(Message.created_at.desc()).first()
            
            # Count unread messages from this user
            unread_count = db.query(Message).filter(
                and_(
                    Message.sender_id == user_id,
                    Message.recipient_id == current_user.id,
                    Message.is_read == False
                )
            ).count()
            
            conversations.append({
                "user_id": user.id,
                "username": user.username,
                "latest_message": latest_message.content if latest_message else None,
                "latest_message_time": latest_message.created_at if latest_message else None,
                "unread_count": unread_count
            })
    
    # Sort by latest message time
    conversations.sort(key=lambda x: x["latest_message_time"] or "1970-01-01", reverse=True)
    return conversations

@messages_router.put("/{message_id}/read")
async def mark_message_read(
    message_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a message as read"""
    message = db.query(Message).filter(
        and_(
            Message.id == message_id,
            Message.recipient_id == current_user.id  # Can only mark own received messages as read
        )
    ).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    message.is_read = True
    db.commit()
    
    return {"message": "Message marked as read"}

@messages_router.get("/unread/count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread messages"""
    unread_count = db.query(Message).filter(
        and_(
            Message.recipient_id == current_user.id,
            Message.is_read == False
        )
    ).count()
    
    return {"unread_count": unread_count}