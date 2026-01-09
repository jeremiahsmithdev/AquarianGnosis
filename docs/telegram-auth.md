---
last_updated: 2026-01-09
status: current
tracks:
  - server/app/core/telegram_auth.py
  - server/app/api/telegram_auth.py
  - client/src/components/auth/TelegramLoginButton.tsx
  - client/src/components/auth/TelegramAccountSettings.tsx
  - client/src/stores/authStore.ts
---

# Telegram Authentication

[← Back to Index](./INDEX.md)

## Overview

- **Purpose**: Allow users to register and login using their Telegram account, reducing friction for users who prefer not to create yet another username/password combination
- **Behavior**: Users can authenticate via Telegram widget, link/unlink Telegram to existing accounts, and import profile data from Telegram
- **Key concepts**:
  - **Auth provider**: Tracks how a user authenticates (`local`, `telegram`, or `both`)
  - **Telegram-only accounts**: Users who register via Telegram have no email/password initially
  - **Account linking**: Existing users can connect their Telegram for easier future logins

## How It Works

### Authentication Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Telegram       │     │  Our Backend     │     │  User Browser   │
│  Servers        │     │                  │     │                 │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
         │  1. User clicks       │                        │
         │     Telegram button   │◄───────────────────────┤
         │                       │                        │
         │  2. Telegram popup    │                        │
         │◄──────────────────────┼────────────────────────┤
         │                       │                        │
         │  3. User authorizes   │                        │
         ├───────────────────────┼───────────────────────►│
         │     (signed data)     │                        │
         │                       │                        │
         │                       │  4. POST /telegram/auth│
         │                       │◄───────────────────────┤
         │                       │     (id, hash, etc.)   │
         │                       │                        │
         │                       │  5. Verify HMAC hash   │
         │                       │     using bot token    │
         │                       │                        │
         │                       │  6. Create/login user  │
         │                       │     Return JWT         │
         │                       ├───────────────────────►│
         │                       │                        │
```

### Three User Scenarios

1. **New user via Telegram**: Creates account with `auth_provider='telegram'`, no email/password required
2. **Existing user links Telegram**: Updates to `auth_provider='both'`, can now login either way
3. **User unlinking Telegram**: Reverts to `auth_provider='local'` (requires email/password first)

## Implementation

### Architecture

| Layer | Component | Responsibility |
|-------|-----------|----------------|
| Frontend | `TelegramLoginButton.tsx` | Renders Telegram widget, handles callback |
| Frontend | `TelegramAccountSettings.tsx` | Link/unlink UI in user settings |
| Frontend | `authStore.ts` | State management for Telegram auth actions |
| Backend | `telegram_auth.py` (core) | HMAC-SHA-256 hash verification |
| Backend | `telegram_auth.py` (api) | REST endpoints for auth operations |
| Database | `User` model | Telegram fields (id, username, photo, etc.) |

### Key Components

| File | Purpose |
|------|---------|
| `server/app/core/telegram_auth.py` | Hash verification using bot token |
| `server/app/api/telegram_auth.py` | `/telegram/auth`, `/telegram/link`, `/telegram/unlink` endpoints |
| `client/src/components/auth/TelegramLoginButton.tsx` | Wraps `react-telegram-login` widget |
| `client/src/components/auth/TelegramAccountSettings.tsx` | Account settings UI for linking |
| `client/src/stores/authStore.ts` | `loginWithTelegram`, `linkTelegram`, `unlinkTelegram` actions |
| `server/migrations/telegram_auth_migration.py` | Adds Telegram fields to users table |

### API Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/v1/telegram/auth` | Login or register via Telegram | No |
| POST | `/api/v1/telegram/link` | Link Telegram to existing account | Yes |
| POST | `/api/v1/telegram/unlink` | Remove Telegram from account | Yes |
| POST | `/api/v1/telegram/import-profile` | Import username/avatar from Telegram | Yes |

### Database Schema

Added to `users` table:

```sql
telegram_id         BIGINT UNIQUE      -- Telegram user ID
telegram_username   VARCHAR(255)       -- @username
telegram_first_name VARCHAR(255)       -- First name from Telegram
telegram_last_name  VARCHAR(255)       -- Last name from Telegram
telegram_photo_url  TEXT               -- Avatar URL
telegram_linked_at  TIMESTAMP          -- When linked
auth_provider       VARCHAR(50)        -- 'local', 'telegram', or 'both'
```

Constraint ensures valid auth: `(email AND password_hash) OR telegram_id`

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from @BotFather (used for hash verification) |
| `VITE_TELEGRAM_BOT_USERNAME` | Yes | Bot username without @ (for widget) |

### Setting Up Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Create new bot with `/newbot`
3. Get the bot token (keep secret, never commit)
4. Set the domain with `/setdomain` → your production domain
5. Add token to server `.env`, username to client `.env`

**Note**: The Telegram Login Widget only works on the domain registered with BotFather. On localhost, a placeholder button is shown.

## Security

### Hash Verification

Telegram signs auth data using HMAC-SHA-256:

```python
# 1. Create secret key from bot token
secret_key = SHA256(bot_token)

# 2. Build data string (alphabetically sorted, excluding hash)
data_check_string = "auth_date=...\nfirst_name=...\nid=...\n..."

# 3. Compute expected hash
expected = HMAC_SHA256(secret_key, data_check_string)

# 4. Compare with timing-safe function
hmac.compare_digest(expected, received_hash)
```

### Replay Attack Prevention

- `auth_date` is validated to be within 24 hours
- Prevents reuse of old authentication data

### Account Security

- Users cannot unlink Telegram if it's their only auth method
- Must set up email/password before unlinking
- Enforced by database constraint and API validation

## Usage Examples

### Frontend: Login with Telegram

```typescript
// In LoginForm.tsx
const handleTelegramAuth = async (telegramUser: TelegramUser) => {
  await loginWithTelegram(telegramUser);
  onSuccess?.();
};

<TelegramLogin onAuth={handleTelegramAuth} disabled={isLoading} />
```

### Frontend: Link Account

```typescript
// In settings page
<TelegramAccountSettings />  // Handles link/unlink internally
```

### Backend: Verify and Create User

```python
# In telegram_auth.py API
telegram_data = TelegramAuthData(**auth_data.model_dump())
if not verify_telegram_auth(telegram_data):
    raise HTTPException(status_code=401, detail="Invalid Telegram authentication")

# Check if user exists, create if not
user = db.query(User).filter(User.telegram_id == auth_data.id).first()
if not user:
    user = User(telegram_id=auth_data.id, auth_provider='telegram', ...)
```

## Related Docs

- [Community Map](./community-map.md) - Users can share location after authenticating
- [Admin Dashboard](./admin-dashboard.md) - Admins can see user auth providers

## Edge Cases & Limitations

| Case | Behavior |
|------|----------|
| Telegram ID already linked to another account | Returns 400 error |
| User tries to unlink without email/password | Returns 400 error with guidance |
| Bot token not configured | Returns 503, Telegram auth disabled |
| Auth data older than 24 hours | Rejected as potential replay attack |
| Username collision on registration | Appends `_1`, `_2`, etc. to make unique |
| Localhost development | Shows placeholder button (widget requires production domain) |
