---
last_updated: 2026-01-09
status: current
tracks:
  - server/app/api/admin.py
  - server/app/schemas/admin.py
  - server/app/core/dependencies.py
  - client/src/pages/AdminDashboardPage.tsx
  - client/src/services/adminService.ts
---

# Admin Dashboard

[← Back to Index](./INDEX.md)

## Overview

- **Purpose**: Centralized administration interface for site management
- **Access**: Restricted to users with `is_admin=true`
- **Features**: Site statistics, user management, forum moderation, resource approval

The admin dashboard provides administrators with tools to monitor site activity, manage users, moderate forum content, and approve community-submitted resources.

## Features

### Overview Tab
Displays site-wide statistics at a glance:
- Total users, active users, admin count
- New user registrations (7-day and 30-day)
- Forum activity (threads and replies)
- Pending vs approved resources
- Study group count

### Users Tab
Full user management with client-side filtering:
- **Search**: Filter by username or email (instant, client-side)
- **Filters**: All users, active only, inactive only, admins only
- **Actions**:
  - Activate/deactivate accounts
  - Grant/revoke admin privileges
  - Delete users (with confirmation)
- **Pagination**: 20 users per page

### Forum Tab
Forum moderation tools:
- Browse categories
- View threads by category
- Pin/unpin threads
- Delete threads

### Resources Tab
Resource approval queue:
- View pending submissions with metadata
- Preview resource URL and description
- Approve (makes public) or reject (deletes)
- Badge shows pending count

## Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ AdminDashboard  │───▶│ adminService.ts             │ │
│  │ Page.tsx        │    │ (API calls + cache-busting) │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                     │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │ admin.py        │◀───│ dependencies.py             │ │
│  │ (endpoints)     │    │ (get_current_admin)         │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Key Components

| File | Purpose |
|------|---------|
| `server/app/api/admin.py` | All admin API endpoints (452 lines) |
| `server/app/schemas/admin.py` | Pydantic request/response schemas |
| `server/app/core/dependencies.py` | `get_current_admin()` dependency |
| `client/src/pages/AdminDashboardPage.tsx` | Main dashboard component |
| `client/src/services/adminService.ts` | Frontend API service layer |
| `client/src/styles/admin.css` | Dashboard styling |

### State Management

The dashboard uses local React state (not Zustand) since admin data doesn't need to persist across navigation:

```typescript
// Tab-specific state
const [stats, setStats] = useState<DashboardStats | null>(null);
const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
const [pendingResources, setPendingResources] = useState<PendingResource[]>([]);

// Client-side filtering with useMemo
const filteredUsers = useMemo(() => {
  // Filter by status and search term
}, [allUsers, userFilter, userSearch]);
```

### Cache-Busting

All GET requests include cache-busting to ensure fresh data:

```typescript
// Shared utility in api.ts
export const getNoCacheConfig = () => ({
  headers: { 'Cache-Control': 'no-cache' },
  params: { _t: Date.now() }
});
```

## API Endpoints

All endpoints require admin authentication via `get_current_admin` dependency.

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/stats` | Dashboard statistics |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List users (paginated, filterable) |
| GET | `/api/v1/admin/users/{id}` | Get single user |
| PUT | `/api/v1/admin/users/{id}` | Update user flags |
| DELETE | `/api/v1/admin/users/{id}` | Delete user |

**Query Parameters (GET /users)**:
- `page` (int, default: 1)
- `page_size` (int, default: 20, max: 10000)
- `search` (string, optional)
- `is_active` (bool, optional)
- `is_admin` (bool, optional)

**Update Body (PUT /users/{id})**:
```json
{
  "is_active": true,
  "is_admin": false,
  "is_verified": true
}
```

### Resource Moderation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/resources/pending` | List pending resources |
| PUT | `/api/v1/admin/resources/{id}/approve` | Approve resource |
| PUT | `/api/v1/admin/resources/{id}/reject` | Reject and delete |

### Forum Moderation
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/v1/admin/threads/{id}/pin` | Pin thread |
| PUT | `/api/v1/admin/threads/{id}/unpin` | Unpin thread |
| DELETE | `/api/v1/admin/threads/{id}` | Delete thread |
| DELETE | `/api/v1/admin/replies/{id}` | Delete reply |

### Category Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/admin/categories` | Create category |
| DELETE | `/api/v1/admin/categories/{id}` | Delete category |

## Security

### Access Control

**Frontend**:
- Admin link only visible in nav when `user.is_admin === true`
- Route `/admin` shows 403 page for non-admins

```tsx
// App.tsx
<Route path="/admin" element={
  user?.is_admin ? (
    <AdminDashboardPage onNavigate={handleNavigate} />
  ) : (
    <div className="access-denied">
      <h1>403 - Access Denied</h1>
    </div>
  )
} />
```

**Backend**:
- All endpoints use `get_current_admin` dependency
- Returns 401 if not authenticated
- Returns 403 if authenticated but not admin

```python
async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
```

### Safety Guards

- Admins cannot remove their own admin privileges
- Admins cannot delete their own account
- Category deletion blocked if threads exist
- Delete operations require confirmation dialog

## Related Docs

- [Community Map](./community-map.md) - User location management
- [About Review System](./about-review-system.md) - Content moderation workflow
