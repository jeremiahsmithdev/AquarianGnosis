"""Migration script for user_locations visibility columns

Adds visibility_type and allowed_users columns to support
public/members/custom visibility settings.

Revision ID: visibility_001
Revises: resource_001
Create Date: 2025-01-01

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'visibility_001'
down_revision = 'resource_001'
branch_labels = None
depends_on = None

def upgrade():
    # Add visibility_type column (public, members, custom)
    op.add_column(
        'user_locations',
        sa.Column('visibility_type', sa.String(20), server_default='public')
    )

    # Add allowed_users column (JSON array of usernames for custom visibility)
    op.add_column(
        'user_locations',
        sa.Column('allowed_users', sa.Text, nullable=True)
    )

def downgrade():
    # Remove columns
    op.drop_column('user_locations', 'allowed_users')
    op.drop_column('user_locations', 'visibility_type')
