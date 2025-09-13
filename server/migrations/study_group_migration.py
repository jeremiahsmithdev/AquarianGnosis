"""Migration script for study group tables

Revision ID: study_group_001
Revises: forum_001
Create Date: 2025-08-02 23:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'study_group_001'
down_revision = 'forum_001'
branch_labels = None
depends_on = None

def upgrade():
    # Create study_groups table
    op.create_table(
        'study_groups',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('creator_id', postgresql.UUID(as_uuid=True)),
        sa.Column('is_location_based', sa.Boolean, default=True),
        sa.Column('max_members', sa.Integer, default=20),
        sa.Column('is_public', sa.Boolean, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['creator_id'], ['users.id'])
    )
    
    # Create study_group_members table
    op.create_table(
        'study_group_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('group_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(20), default="member"),
        sa.Column('joined_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['group_id'], ['study_groups.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'])
    )

def downgrade():
    # Drop tables in reverse order
    op.drop_table('study_group_members')
    op.drop_table('study_groups')
