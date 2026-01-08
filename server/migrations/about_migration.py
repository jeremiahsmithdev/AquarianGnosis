"""Migration script for about page review/edit system

Adds:
- is_admin column to users table
- about_content_blocks table for page content
- about_comments table for text comments
- about_comment_replies table for comment threads
- about_edit_suggestions table for edit suggestions

Revision ID: about_001
Revises: visibility_001
Create Date: 2025-01-03

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers
revision = 'about_001'
down_revision = 'visibility_001'
branch_labels = None
depends_on = None

def upgrade():
    # Add is_admin column to users table
    op.add_column(
        'users',
        sa.Column('is_admin', sa.Boolean, server_default='false', nullable=False)
    )

    # Create about_content_blocks table
    op.create_table(
        'about_content_blocks',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('block_type', sa.String(50), nullable=False),
        sa.Column('block_key', sa.String(100), unique=True, nullable=False),
        sa.Column('display_order', sa.Integer, nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('parent_block_id', UUID(as_uuid=True), sa.ForeignKey('about_content_blocks.id', ondelete='CASCADE'), nullable=True),
        sa.Column('is_active', sa.Boolean, server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_about_content_blocks_block_key', 'about_content_blocks', ['block_key'])
    op.create_index('ix_about_content_blocks_display_order', 'about_content_blocks', ['display_order'])

    # Create about_comments table
    op.create_table(
        'about_comments',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('block_id', UUID(as_uuid=True), sa.ForeignKey('about_content_blocks.id', ondelete='CASCADE'), nullable=False),
        sa.Column('author_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('start_offset', sa.Integer, nullable=False),
        sa.Column('end_offset', sa.Integer, nullable=False),
        sa.Column('selected_text', sa.Text, nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_resolved', sa.Boolean, server_default='false', nullable=False),
        sa.Column('resolved_by', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_about_comments_block_id', 'about_comments', ['block_id'])
    op.create_index('ix_about_comments_author_id', 'about_comments', ['author_id'])

    # Create about_comment_replies table
    op.create_table(
        'about_comment_replies',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('comment_id', UUID(as_uuid=True), sa.ForeignKey('about_comments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('author_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_about_comment_replies_comment_id', 'about_comment_replies', ['comment_id'])

    # Create about_edit_suggestions table
    op.create_table(
        'about_edit_suggestions',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('block_id', UUID(as_uuid=True), sa.ForeignKey('about_content_blocks.id', ondelete='CASCADE'), nullable=False),
        sa.Column('author_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('start_offset', sa.Integer, nullable=False),
        sa.Column('end_offset', sa.Integer, nullable=False),
        sa.Column('original_text', sa.Text, nullable=False),
        sa.Column('suggested_text', sa.Text, nullable=False),
        sa.Column('status', sa.String(20), server_default='pending', nullable=False),
        sa.Column('reviewed_by', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('review_note', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('NOW()'))
    )
    op.create_index('ix_about_edit_suggestions_block_id', 'about_edit_suggestions', ['block_id'])
    op.create_index('ix_about_edit_suggestions_status', 'about_edit_suggestions', ['status'])

def downgrade():
    # Drop tables in reverse order
    op.drop_table('about_edit_suggestions')
    op.drop_table('about_comment_replies')
    op.drop_table('about_comments')
    op.drop_table('about_content_blocks')

    # Remove is_admin column
    op.drop_column('users', 'is_admin')
