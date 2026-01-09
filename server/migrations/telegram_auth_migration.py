"""Migration script for Telegram authentication fields

Revision ID: telegram_001
Revises: forum_001
Create Date: 2025-01-09

Adds Telegram authentication support to the users table:
- telegram_id: Unique Telegram user ID
- telegram_username: @username from Telegram
- telegram_first_name, telegram_last_name: Profile name
- telegram_photo_url: Avatar URL
- telegram_linked_at: When Telegram was linked
- auth_provider: Tracks authentication method ('local', 'telegram', 'both')

Also makes email and password_hash nullable to support Telegram-only accounts.
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'telegram_001'
down_revision = 'forum_001'
branch_labels = None
depends_on = None


def upgrade():
    # Add Telegram authentication fields to users table
    op.add_column('users', sa.Column('telegram_id', sa.BigInteger(), nullable=True))
    op.add_column('users', sa.Column('telegram_username', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('telegram_first_name', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('telegram_last_name', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('telegram_photo_url', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('telegram_linked_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('users', sa.Column('auth_provider', sa.String(50), server_default='local', nullable=False))

    # Create unique index on telegram_id for fast lookups
    op.create_index('ix_users_telegram_id', 'users', ['telegram_id'], unique=True)

    # Make email nullable (for Telegram-only accounts)
    op.alter_column('users', 'email', existing_type=sa.String(255), nullable=True)

    # Make password_hash nullable (for Telegram-only accounts)
    op.alter_column('users', 'password_hash', existing_type=sa.String(255), nullable=True)

    # Add check constraint: user must have either email+password OR telegram_id
    op.execute("""
        ALTER TABLE users ADD CONSTRAINT valid_auth_method CHECK (
            (email IS NOT NULL AND password_hash IS NOT NULL)
            OR telegram_id IS NOT NULL
        )
    """)


def downgrade():
    # Remove check constraint
    op.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_auth_method")

    # Make email and password_hash NOT NULL again
    # Note: This will fail if there are Telegram-only users
    op.alter_column('users', 'password_hash', existing_type=sa.String(255), nullable=False)
    op.alter_column('users', 'email', existing_type=sa.String(255), nullable=False)

    # Drop index
    op.drop_index('ix_users_telegram_id', table_name='users')

    # Drop Telegram columns
    op.drop_column('users', 'auth_provider')
    op.drop_column('users', 'telegram_linked_at')
    op.drop_column('users', 'telegram_photo_url')
    op.drop_column('users', 'telegram_last_name')
    op.drop_column('users', 'telegram_first_name')
    op.drop_column('users', 'telegram_username')
    op.drop_column('users', 'telegram_id')
