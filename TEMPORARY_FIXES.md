# Temporary Fixes Documentation

This document tracks all temporary fixes applied to get the Aquarian Gnosis application running, along with instructions to revert them and implement proper solutions.

## 1. Inline Type Definitions (High Priority Fix Needed)

### Current State
TypeScript interfaces are defined inline within each file instead of using centralized types.

### Files Affected
- `client/src/services/api.ts` - All types defined inline (User, LoginRequest, RegisterRequest, AuthResponse, UserLocation, LocationRequest, Message, MessageRequest)
- `client/src/stores/authStore.ts` - User, LoginRequest, RegisterRequest
- `client/src/stores/messageStore.ts` - Message, MessageRequest  
- `client/src/stores/mapStore.ts` - UserLocation, MapStats, MapFilters, GeolocationCoords
- `client/src/components/auth/LoginForm.tsx` - LoginRequest
- `client/src/components/auth/RegisterForm.tsx` - RegisterRequest
- `client/src/components/map/InteractiveMap.tsx` - UserLocation

### Root Cause
- Module resolution conflicts between old type files and new centralized types
- Vite build tool caching issues with TypeScript module exports
- Import path resolution problems with `src/types/index.ts`

### How to Revert and Fix Properly

#### Step 1: Verify Centralized Types
```bash
cd client/src/types
# Ensure only index.ts exists with all exports
ls -la
# Should only show: index.ts
```

#### Step 2: Test Module Resolution
```bash
# In client directory
npx tsc --noEmit --strict
# Should show no errors
```

#### Step 3: Update Imports Systematically
Replace inline types with imports one file at a time:

```typescript
// Replace this:
interface User {
  id: string;
  // ...
}

// With this:
import { User } from '../types';
```

#### Step 4: Clear Build Cache
```bash
rm -rf client/node_modules/.vite
pm2 restart aquarian-gnosis-frontend
```

#### Step 5: Test After Each Change
Verify app loads after each file modification.

### Proper Solution
1. Ensure TypeScript configuration supports path mapping
2. Use absolute imports: `import { User } from '@/types'`
3. Configure Vite for proper TypeScript resolution
4. Set up proper barrel exports in types/index.ts

---

## 2. Aggressive Service Worker Clearing (Medium Priority)

### Current State
Added automatic service worker unregistration in `client/src/main.tsx`:

```typescript
// Aggressively unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    let hasServiceWorkers = registrations.length > 0;
    for(let registration of registrations) {
      registration.unregister().then(() => {
        console.log('Service worker unregistered');
      });
    }
    
    // Force reload after clearing service workers
    if (hasServiceWorkers) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  });
  
  // Also clear any cached service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
  }
}
```

### Root Cause
- Cached service worker from another application interfering with resource loading
- Service worker intercepting and failing to serve Vite dev server resources

### How to Revert
Remove the entire service worker clearing block from `client/src/main.tsx` lines 6-28.

### Proper Solution
1. Identify source of rogue service worker
2. Configure proper service worker scoping if needed
3. Use browser dev tools Application tab to manage service workers manually
4. Implement proper service worker only when needed for PWA features

---

## 3. Cache Control Meta Tags (Low Priority)

### Current State
Added no-cache meta tags in `client/index.html`:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

### Root Cause
Browser caching was interfering with development hot reloading.

### How to Revert
Remove lines 7-9 from `client/index.html`.

### Proper Solution
1. Configure Vite dev server with proper cache headers
2. Use browser dev tools "Disable cache" during development
3. Implement proper cache strategies for production builds

---

## 4. Backend Configuration Workarounds (Medium Priority)

### Current State
Updated `server/app/core/config.py` to use deprecated validator syntax:

```python
# From:
@field_validator("ALLOWED_HOSTS", mode="before")

# To:
def get_allowed_hosts_list(self) -> List[str]:
    """Convert ALLOWED_HOSTS string to list"""
    return [host.strip() for host in self.ALLOWED_HOSTS.split(",")]
```

### Root Cause
Pydantic v2 field validation syntax incompatibility with configuration parsing.

### How to Revert and Fix
1. Update to proper Pydantic v2 field validator syntax
2. Ensure environment variable parsing handles list types correctly
3. Test with updated pydantic-settings version

### Proper Solution
```python
from pydantic import field_validator

@field_validator("ALLOWED_HOSTS", mode="before")
@classmethod
def parse_allowed_hosts(cls, v):
    if isinstance(v, str):
        return [host.strip() for host in v.split(",")]
    return v
```

---

## 5. Port Configuration Changes (Low Priority)

### Current State
- Frontend runs on port 3000 (changed from default 5173)
- Updated in `client/vite.config.ts`, `ecosystem.config.js`, `run.sh`

### Root Cause
Port 5173 was occupied by another service causing conflicts.

### How to Revert
1. Stop process using port 5173: `lsof -ti:5173 | xargs kill`
2. Revert port back to 5173 in configuration files
3. Update CORS settings in backend accordingly

### Proper Solution
- Use dynamic port assignment in development
- Configure proper port management in development environment
- Document port usage in project README

---

## Diagnostic Commands

### Check TypeScript Module Resolution
```bash
cd client
npx tsc --showConfig
npx tsc --noEmit --listFiles | grep types
```

### Check Vite Build Issues
```bash
cd client
npm run build
# Look for any module resolution errors
```

### Check Service Worker Status
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs));
```

### Check Port Usage
```bash
lsof -i :3000
lsof -i :5173
lsof -i :8000
```

### Check PM2 Process Health
```bash
npm run pm2:status
npm run pm2:logs
```

---

## Priority Order for Fixes

1. **High Priority**: Fix TypeScript module resolution and centralized types
2. **Medium Priority**: Remove service worker workarounds and fix backend config  
3. **Low Priority**: Remove cache control meta tags and normalize ports

## Testing Checklist

After implementing proper fixes:
- [ ] App loads without errors at http://localhost:3000
- [ ] No TypeScript compilation errors
- [ ] No service worker conflicts
- [ ] Authentication flows work
- [ ] Map functionality loads
- [ ] Hot reloading works in development
- [ ] Production build succeeds
- [ ] PM2 processes start/stop cleanly

---

## Notes

- Always test fixes in a separate branch
- Revert to working state if any fix breaks the application
- Update this document when fixes are properly implemented
- Remove sections from this document once fixes are complete