"""Migration script for shared resources table

Revision ID: resource_001
Revises: study_group_001
Create Date: 2025-08-02 23:45:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'resource_001'
down_revision = 'study_group_001'
branch_labels = None
depends_on = None

def upgrade():
    # Create shared_resources table
    op.create_table(
        'shared_resources',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('url', sa.String(500)),
        sa.Column('description', sa.Text),
        sa.Column('resource_type', sa.String(50)),
        sa.Column('submitted_by', postgresql.UUID(as_uuid=True)),
        sa.Column('upvotes', sa.Integer, default=0),
        sa.Column('downvotes', sa.Integer, default=0),
        sa.Column('is_approved', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['submitted_by'], ['users.id'])
    )

def downgrade():
    # Drop table
    op.drop_table('shared_resources')
