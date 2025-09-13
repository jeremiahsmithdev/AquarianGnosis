"""Migration script for forum tables

Revision ID: forum_001
Revises: 
Create Date: 2025-08-02 23:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'forum_001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create forum_categories table
    op.create_table(
        'forum_categories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('display_order', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'))
    )
    
    # Create forum_threads table
    op.create_table(
        'forum_threads',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('category_id', postgresql.UUID(as_uuid=True)),
        sa.Column('author_id', postgresql.UUID(as_uuid=True)),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('upvotes', sa.Integer, default=0),
        sa.Column('downvotes', sa.Integer, default=0),
        sa.Column('is_pinned', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['category_id'], ['forum_categories.id']),
        sa.ForeignKeyConstraint(['author_id'], ['users.id'])
    )
    
    # Create forum_replies table
    op.create_table(
        'forum_replies',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('thread_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('author_id', postgresql.UUID(as_uuid=True)),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('parent_reply_id', postgresql.UUID(as_uuid=True)),
        sa.Column('upvotes', sa.Integer, default=0),
        sa.Column('downvotes', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['thread_id'], ['forum_threads.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['author_id'], ['users.id']),
        sa.ForeignKeyConstraint(['parent_reply_id'], ['forum_replies.id'])
    )

def downgrade():
    # Drop tables in reverse order
    op.drop_table('forum_replies')
    op.drop_table('forum_threads')
    op.drop_table('forum_categories')
