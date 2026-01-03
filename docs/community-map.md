---
last_updated: 2026-01-03
status: current
tracks:
  - client/src/components/map/InteractiveMap.tsx
  - client/src/components/map/LocationManager.tsx
  - client/src/components/map/LocationSearch.tsx
  - client/src/components/map/MapFilters.tsx
  - client/src/pages/MapPage.tsx
  - client/src/stores/mapStore.ts
  - server/app/api/map.py
  - server/app/models/user.py
---

# Community Map

[← Back to Index](./INDEX.md)

## Overview

The Community Map allows users to share their location and discover other gnostics nearby. Users control their privacy through a three-tier visibility system.

### Purpose
- Connect community members geographically
- Enable users to find study partners and groups in their area
- Respect privacy through granular visibility controls

### Key Concepts

| Term | Definition |
|------|------------|
| **Visibility Type** | Who can see a user's location: `public`, `members`, or `custom` |
| **Status** | User's location permanence: `permanent`, `traveling`, or `nomadic` |
| **Nearby Locations** | Other users within a configurable radius (default 50km) |

## How It Works

### For Unauthenticated Users
- View public locations on the map (read-only)
- See total user count and sharing statistics
- Prompted to sign in to add location or message users

### For Authenticated Users
1. **Add Location** via three methods:
   - GPS detection (browser geolocation)
   - Click on map to select coordinates
   - Search by city/address (Radar.io autocomplete)

2. **Set Visibility**:
   - **Public**: Visible to everyone, including unauthenticated visitors
   - **Members**: Visible only to signed-in users
   - **Custom**: Visible only to specific usernames you specify

3. **Filter Nearby Users**:
   - Adjust search radius (10-500km)
   - Filter by status (permanent/traveling/nomadic)

### Visibility Permission Logic

```
IF visibility_type == 'public' AND is_public == true:
    → Visible to everyone

ELSE IF visibility_type == 'members':
    → Visible only if viewer is authenticated

ELSE IF visibility_type == 'custom':
    → Visible only if viewer's username is in allowed_users list
```

## Implementation

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      MapPage.tsx                        │
│  (Coordinates state between LocationManager and Map)    │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────────┐ ┌──────────────┐ ┌─────────────┐
│ LocationManager│ │InteractiveMap│ │  MapFilters │
│ (Add/Edit UI) │ │  (Leaflet)   │ │ (Radius/    │
│               │ │              │ │  Status)    │
└───────┬───────┘ └──────────────┘ └─────────────┘
        │
        ▼
┌───────────────┐
│LocationSearch │
│ (Radar.io)    │
└───────────────┘
```

### Key Components

| File | Purpose |
|------|---------|
| `client/src/pages/MapPage.tsx` | Page layout, coordinates click-select mode between components |
| `client/src/components/map/InteractiveMap.tsx` | Leaflet map, marker rendering, geolocation |
| `client/src/components/map/LocationManager.tsx` | Add/edit location form, visibility controls |
| `client/src/components/map/LocationSearch.tsx` | Radar.io autocomplete for address search |
| `client/src/components/map/MapFilters.tsx` | Radius slider, status dropdown |
| `client/src/stores/mapStore.ts` | Zustand store for map state and API calls |
| `server/app/api/map.py` | All map API endpoints |
| `server/app/models/user.py` | `UserLocation` model with visibility fields |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/map/location` | Required | Get current user's location |
| POST | `/map/location` | Required | Create/update user's location |
| PUT | `/map/location` | Required | Update user's location |
| DELETE | `/map/location` | Required | Remove user's location |
| GET | `/map/locations` | Required | Get nearby locations (filtered by visibility) |
| GET | `/map/locations/public` | None | Get all public locations |
| GET | `/map/stats` | None | Get map statistics |

### Data Model

```python
class UserLocation:
    id: UUID
    user_id: UUID (FK → users.id)
    latitude: Decimal(10, 8)
    longitude: Decimal(11, 8)
    is_public: Boolean (default: True)
    status: String  # 'permanent' | 'traveling' | 'nomadic'
    visibility_type: String  # 'public' | 'members' | 'custom'
    allowed_users: Text  # JSON array of usernames (for 'custom')
    created_at: DateTime
    updated_at: DateTime
```

### Key Functions

**Frontend:**
- `createColoredIcon(color)` - Factory for Leaflet marker icons (green/red/blue)
- `useMapStore.getNearbyLocations()` - Fetches filtered nearby users
- `LocationManager.handleSave()` - Saves location with visibility settings

**Backend:**
- `check_visibility_permission(location, viewer_username)` - Determines if location is visible to viewer
- `calculate_distance(lat1, lon1, lat2, lon2)` - Haversine formula for km distance
- `get_nearby_locations()` - Returns locations within radius, respecting visibility

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_RADAR_PUBLISHABLE_KEY` | Yes | Radar.io publishable API key for location search |

**Note:** The Radar key should be set in `.env.local` for development. For production, configure via deployment environment (not committed to git).

### Map Defaults

| Setting | Default | Range |
|---------|---------|-------|
| Search radius | 50km | 10-500km |
| Initial zoom | 2 (world view) | - |
| Geolocation zoom | 15 (street level) | - |

## Usage Examples

### Adding a Location (Frontend)

```typescript
const { addUserLocation } = useMapStore();

await addUserLocation({
  latitude: 40.7128,
  longitude: -74.0060,
  is_public: true,
  status: 'permanent',
  visibility_type: 'members',
  allowed_users: []
});
```

### Custom Visibility (Frontend)

```typescript
await addUserLocation({
  latitude: 40.7128,
  longitude: -74.0060,
  is_public: false,
  status: 'traveling',
  visibility_type: 'custom',
  allowed_users: ['alice', 'bob', 'charlie']
});
```

### Checking Visibility (Backend)

```python
def check_visibility_permission(location, viewer_username):
    if location.visibility_type == 'public':
        return location.is_public
    if location.visibility_type == 'members':
        return viewer_username is not None
    if location.visibility_type == 'custom':
        allowed = json.loads(location.allowed_users or '[]')
        return viewer_username in allowed
    return location.is_public  # Backwards compatibility
```

## Related Docs

- [PRD.md](./PRD.md) - Product Requirements Document (full project scope)

## Edge Cases & Limitations

### Visibility
- `visibility_type='custom'` with empty `allowed_users` list: Location visible to no one except owner
- Legacy locations without `visibility_type`: Default to `is_public` flag for backwards compatibility

### Distance Calculation
- Uses Haversine formula (great-circle distance)
- Bounding box pre-filter for database performance, then exact distance in Python
- Locations exactly on the radius boundary are included

### Location Search
- Radar.io free tier has rate limits
- Search requires minimum 2 characters
- Results debounced by 300ms to reduce API calls

### Database
- `allowed_users` stored as JSON text (not normalized)
- Usernames are case-insensitive (lowercased on save)
- Migration: `server/migrations/visibility_migration.py` adds visibility columns
