# CLAUDE.md - Development Guidelines & Technical Debt Analysis

## TODO: Shared Resources Implementation

**IMPORTANT**: The Resources page shared resources functionality has been refactored (2025-01-XX):

- **Removed**: Standalone "Shared Resources" tab
- **Added**: Integrated shared resource forms within each existing tab (blogs, books, video, audio, art)
- **Functionality**:
  - When user is authenticated and API is available, each tab shows a "Share [TabType]" button
  - Form allows users to add community-contributed resources of that specific type
  - Shared resources appear alongside static content within each tab
  - Resources are filtered by `resource_type` matching the active tab
  - Art tab displays shared resources as images in the art gallery layout
  - Other tabs display shared resources as standard resource cards with voting UI

**Files Modified**:
- `client/src/pages/ResourcesPage.tsx:17,95-156,294-469` - Refactored shared resource functionality
- `client/src/stores/navigationStore.ts:13,21` - Removed 'shared' from resources tab types

**Next Steps**: Test the implementation with authenticated users to ensure resource creation and filtering works correctly.

---

## Project Overview
This document serves as the central reference for Claude Code when working on the Aquarian Gnosis project. It contains architecture guidelines, identified technical debt, improvement roadmaps, and maintenance instructions.

**Last Updated**: 2025-08-02  
**Current Phase**: Phase 2 - Community Foundation  
**Next Review**: After Phase 2 completion or significant feature implementation

---

## ⚠️ PM2 Process Management (CRITICAL)

**ALWAYS use PM2 for server management. Never start servers manually.**

### PM2 Service Management Workflow

1. **Before starting any servers, ALWAYS check for existing PM2 processes:**
   ```bash
   pm2 list
   ```

2. **If processes exist, restart them instead of creating new ones:**
   ```bash
   pm2 restart ecosystem.config.js --update-env
   ```

3. **If no processes exist, start them:**
   ```bash
   pm2 start ecosystem.config.js
   ```

4. **Available PM2 commands:**
   - `npm run dev` - Start both services via PM2
   - `npm run dev:backend` - Start only backend via PM2  
   - `npm run dev:frontend` - Start only frontend via PM2
   - `npm run pm2:start` - Start all PM2 processes
   - `npm run pm2:stop` - Stop all PM2 processes
   - `npm run pm2:restart` - Restart all PM2 processes
   - `npm run pm2:status` - Check PM2 process status
   - `npm run pm2:logs` - View PM2 logs

### PM2 Process Configuration

The project uses `ecosystem.config.js` which defines:
- **Backend**: `aquarian-gnosis-backend` (runs via `./server/start_backend.sh`)
- **Frontend**: `aquarian-gnosis-frontend` (runs `npm run dev` in client directory)

### Important Notes for Claude Sessions

- **NEVER** use `python run.py` directly
- **NEVER** use `npm run dev` in client directory directly  
- **NEVER** use `uvicorn` commands directly
- **ALWAYS** check `pm2 list` before starting servers
- **ALWAYS** use the PM2 npm scripts or ecosystem.config.js
- If you encounter "Address already in use" errors, check PM2 processes first

### Port Configuration
- Frontend: `localhost:3000` (managed by PM2)
- Backend: `localhost:5040` (managed by PM2)

---

## 🚀 Production Deployment (Oracle Server)

**Production Server**: `opc@oracle`
**Production Path**: `/opt/aquariangnosis`

### Production Deployment Process

The production deployment is automated via GitHub webhook:

1. **Webhook URL**: `https://aquariangnosis.org:9000/webhook`
2. **Webhook Script**: `webhook.py` (runs on port 9000)
3. **Automatic Steps on Git Push to Master**:
   - Git pull latest changes
   - Install Python dependencies (`pip install -r requirements.txt`)
   - Install Node dependencies (`npm install`)
   - **Build production frontend** (`npm run build`)
   - Restart PM2 services (`pm2 restart ecosystem.config.js`)

### Production Environment Variables

Production uses different configuration:
- `NODE_ENV=production`
- `VITE_API_BASE_URL=https://aquariangnosis.org/api/v1`
- Frontend serves via `npm run preview` (built files)

### Manual Production Commands

**Only use these if webhook fails:**

```bash
# SSH to production
ssh opc@oracle

# Navigate to project
cd /opt/aquariangnosis

# Manual deployment steps
git pull
./server/venv/bin/pip install -r ./server/requirements.txt
cd client && npm install && npm run build && cd ..
pm2 restart ecosystem.config.js --env production
```

### Production PWA Notes

- Production builds generate proper service worker and manifest files
- PWA install should work correctly after `npm run build`
- Manifest served at: `https://aquariangnosis.org/manifest.webmanifest`
- Service worker at: `https://aquariangnosis.org/sw.js`

### PM2 Troubleshooting

#### Common Issues & Solutions

1. **"Address already in use" Error**
   ```bash
   # Check what PM2 processes are running
   pm2 list
   
   # If processes are running, restart them
   pm2 restart ecosystem.config.js --update-env
   
   # If processes are stuck, stop and start
   pm2 stop ecosystem.config.js
   pm2 start ecosystem.config.js
   ```

2. **Service Not Starting**
   ```bash
   # Check PM2 logs for errors
   pm2 logs aquarian-gnosis-backend
   pm2 logs aquarian-gnosis-frontend
   
   # Check individual service logs
   pm2 show aquarian-gnosis-backend
   pm2 show aquarian-gnosis-frontend
   ```

3. **Environment Variables Not Updating**
   ```bash
   # Always use --update-env when restarting
   pm2 restart ecosystem.config.js --update-env
   ```

4. **Process Health Check**
   ```bash
   # View process status
   pm2 status
   
   # Monitor processes in real-time
   pm2 monit
   
   # Check process uptime and restarts
   pm2 list
   ```

#### Emergency Commands

- **Kill all PM2 processes**: `pm2 kill` (use with caution)
- **Force restart**: `pm2 restart ecosystem.config.js --force`
- **Delete all processes**: `pm2 delete ecosystem.config.js`

---

## Architecture Overview

### Frontend Stack
- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 7.0.4
- **State Management**: Zustand 4.5.7
- **Styling**: CSS Modules approach with component-specific stylesheets
- **Map Library**: Leaflet.js 1.9.4
- **Routing**: React Router DOM

### Backend Stack
- **Framework**: FastAPI 0.115.0
- **Database**: PostgreSQL with SQLAlchemy 2.0.36
- **Authentication**: JWT with python-jose
- **Migration Tool**: Alembic 1.14.0
- **Server**: Uvicorn 0.32.0

---

## Current Technical Debt & Issues

### 🔴 Critical Issues (Fix Before Phase 3)

#### Frontend Critical Issues
1. **Security Vulnerabilities**
   - **Issue**: Hardcoded API URL in `services/api.ts:13`
   - **Impact**: Cannot deploy to different environments
   - **Fix**: Move to environment variables via Vite's `import.meta.env`
   - **Location**: `client/src/services/api.ts:13`

2. **Error Boundary Missing**
   - **Issue**: No global error boundary for React component crashes
   - **Impact**: White screen of death on component errors
   - **Fix**: Implement ErrorBoundary component
   - **Location**: `client/src/App.tsx` (needs wrapper)

#### Backend Critical Issues
1. **Security Configuration**
   - **Issue**: Hardcoded secret key in `config.py:9`
   - **Impact**: Security vulnerability in production
   - **Fix**: Move to environment variables with strong random generation
   - **Location**: `server/app/core/config.py:9`

2. **Database Migration Management**
   - **Issue**: No automated migration system in deployment
   - **Impact**: Manual database updates required
   - **Fix**: Implement proper Alembic migration workflow
   - **Location**: `server/migrations/` (incomplete setup)

### 🟡 High Priority Issues (Fix During Phase 2)

#### Frontend High Priority
1. **Type System Completeness**
   - **Issue**: Incomplete type definitions and exports
   - **Problems**:
     - Missing proper `ApiError` export in `types/index.ts`
     - Inconsistent error handling types across stores
     - Missing loading state types
   - **Fix**: Create comprehensive type definitions
   - **Location**: `client/src/types/index.ts`

2. **Component Export Patterns**
   - **Issue**: Inconsistent component export/import patterns
   - **Problems**:
     - Missing `index.ts` files in some component directories
     - Mix of default and named exports
     - Inconsistent barrel export patterns
   - **Fix**: Standardize all component exports
   - **Locations**: `client/src/components/*/` (various missing index files)

#### Backend High Priority
1. **API Error Handling Middleware**
   - **Issue**: No centralized error handling middleware
   - **Impact**: Inconsistent error responses
   - **Fix**: Implement FastAPI exception handlers
   - **Location**: `server/app/main.py` (needs middleware addition)

2. **Logging System**
   - **Issue**: No structured logging implementation
   - **Impact**: Difficult debugging and monitoring
   - **Fix**: Implement structured logging with correlation IDs
   - **Location**: New `server/app/core/logging.py` needed

### 🟢 Medium Priority Issues (Address During Phase 2)

#### Frontend Medium Priority
1. **Accessibility Compliance**
   - **Issue**: Missing ARIA labels and focus management
   - **Impact**: Poor screen reader experience
   - **Fix**: Add comprehensive accessibility features
   - **Locations**: All component files

2. **State Management Consistency**
   - **Issue**: Different error handling patterns across stores
   - **Problems**:
     - `authStore.ts` vs `mapStore.ts` have different error handling
     - Inconsistent loading state management
     - No global loading indicator
   - **Fix**: Standardize store patterns with shared utilities
   - **Locations**: `client/src/stores/*.ts`

#### Backend Medium Priority
1. **API Documentation**
   - **Issue**: No auto-generated API documentation
   - **Impact**: Difficult for frontend development
   - **Fix**: Enable FastAPI's automatic OpenAPI documentation
   - **Location**: `server/app/main.py` (enable docs)

2. **Testing Framework**
   - **Issue**: No test suite implementation
   - **Impact**: No automated testing
   - **Fix**: Implement pytest test suite
   - **Location**: `server/tests/` (directory exists but empty)

---

## Improvement Roadmap

### Phase 1 Cleanup (Complete)
- ✅ **Environment Configuration Overhaul**
- ✅ **Navigation System Upgrade**
- ✅ **Error Handling Foundation**

### Phase 2 Enhancements (In Progress)

#### Performance & Accessibility
- [ ] **Performance Optimizations**
  - Implement code splitting for all pages
  - Add lazy loading for images and components
  - Optimize bundle size analysis
  - Implement service worker for caching

- [ ] **Accessibility Compliance**
  - Add ARIA labels to all interactive elements
  - Implement proper focus management
  - Add keyboard navigation support
  - Test with screen readers

#### Backend Robustness
- [ ] **Testing & Documentation**
  - Implement comprehensive test suite
  - Enable and customize FastAPI documentation
  - Add API integration tests
  - Implement automated testing pipeline

- [ ] **Monitoring & Logging**
  - Implement structured logging system
  - Add health check endpoints
  - Set up error tracking and monitoring
  - Implement request correlation IDs

#### Community Features (In Progress)
- ✅ **Forum System Implementation**
  - Database models and schemas created
  - API endpoints implemented
  - Frontend components created

- ✅ **Study Group System Implementation**
  - Database models and schemas created
  - API endpoints implemented
  - Frontend components created

- ✅ **Resource Sharing System Implementation**
  - Database models and schemas created
  - API endpoints implemented
  - Frontend components created

- [ ] **Enhanced User Profiles**
  - Profile customization options
  - User bio and interests
  - Activity history and statistics
  - Anonymity level controls

---

## Code Quality Standards

### Frontend Standards
```typescript
// Type definitions - Always use explicit types
interface ComponentProps {
  id: string;
  isLoading: boolean;
  onSuccess: (data: ResponseData) => void;
}

// Error handling - Consistent pattern
try {
  const result = await apiCall();
  handleSuccess(result);
} catch (error) {
  handleError(error as ApiError);
}

// Component exports - Use named exports with barrel files
export type { ComponentName } from './ComponentName';
```

### CSS Standards
```css
/* Use CSS custom properties for consistency */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #1d4ed8;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --border-radius: 8px;
}

/* Component-specific classes with BEM-like naming */
.component-name {
  /* Base styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}
```

### Backend Standards
```python
# Error handling - Use custom exception classes
class BusinessLogicError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)

# API endpoints - Consistent response format
@router.get("/endpoint")
async def get_data() -> StandardResponse[DataType]:
    try:
        data = await service.get_data()
        return StandardResponse(data=data, message="Success")
    except Exception as e:
        logger.error(f"Error in get_data: {e}")
        raise BusinessLogicError("Failed to retrieve data")
```

---

## File Organization Standards

### Frontend Structure
```
client/src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components
│   ├── auth/            # Authentication components
│   ├── map/             # Map-related components
│   └── messaging/       # Messaging components
├── pages/               # Page-level components
├── stores/              # Zustand stores
├── services/            # API and external services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── hooks/               # Custom React hooks (to be added)
└── styles/              # Component-specific stylesheets
```

### Backend Structure
```
server/app/
├── api/                 # API route handlers
├── core/                # Core configuration and utilities
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── services/            # Business logic services
├── utils/               # Utility functions
└── tests/               # Test suite (to be implemented)
```

---

## Development Workflow Guidelines

### Before Starting New Features
1. **Update This Document**: Review and update technical debt items
2. **Environment Check**: Ensure all environment variables are properly configured
3. **Type Safety**: Run TypeScript compiler with strict mode
4. **Code Quality**: Run ESLint and ensure no warnings
5. **Testing**: Run existing tests (once implemented)

### After Completing Features
1. **Technical Debt Review**: Check if new technical debt was introduced
2. **Documentation Update**: Update this CLAUDE.md file
3. **Performance Check**: Analyze bundle size and performance impact
4. **Accessibility Test**: Verify accessibility compliance
5. **Update Status**: Mark completed items and add new issues found

### Code Review Checklist
- [ ] No hardcoded values (use environment variables)
- [ ] Consistent error handling patterns
- [ ] Proper TypeScript types throughout
- [ ] Accessible markup with ARIA labels
- [ ] Consistent CSS class naming
- [ ] No console.log statements in production code
- [ ] Proper loading states and error boundaries
- [ ] Security best practices followed

### Git Commit Guidelines
Use clean, concise commit messages following conventional commit format:

```
feat: brief description of the change

- Bullet point explaining key changes
- Another important change
- Third change if needed
```

**Important Rules:**
- Keep messages concise and focused
- Use conventional commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- **Do NOT include**:
  - `🤖 Generated with [Claude Code]` footer
  - `Co-Authored-By: Claude <noreply@anthropic.com>` attribution
  - Overly verbose descriptions or explanations
- Focus on **what** changed, not **how** or **why** in detail
- Use bullet points for multiple changes
- DO NOT pre-emptively commit without being instructed to do so.

**Example:**
```
feat: implement community forum system

- Add forum models, schemas, and API endpoints
- Create CommunityPage component with category and thread functionality
- Add CSS styles for forum interface
```

---

## Environment Configuration

### Development Setup
```bash
# Frontend environment variables (.env.local)
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_TITLE=Aquarian Gnosis
VITE_APP_DESCRIPTION=Gnostic Community Platform

# Backend environment variables (.env)
DATABASE_URL=postgresql://postgres:password@localhost/aquarian_gnosis
SECRET_KEY=your-super-secret-key-generate-new-one
REDIS_URL=redis://localhost:6379
ALLOWED_HOSTS=http://localhost:3000,http://localhost:5173
```

### Production Considerations
- Use strong, randomly generated SECRET_KEY
- Configure proper DATABASE_URL for production database
- Set up HTTPS-only cookies for JWT tokens
- Configure CORS origins for production domains
- Enable API rate limiting
- Set up proper logging and monitoring

---

## Testing Strategy

### Frontend Testing (To Be Implemented)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev vitest jsdom

# Test structure
client/src/__tests__/
├── components/          # Component unit tests
├── pages/              # Page integration tests
├── stores/             # Store logic tests
└── utils/              # Utility function tests
```

### Backend Testing (Partially Set Up)
```bash
# Already installed: pytest, pytest-asyncio, httpx
# Run tests with:
cd server && python -m pytest

# Test structure needed:
server/tests/
├── test_auth.py        # Authentication tests
├── test_users.py       # User management tests
├── test_map.py         # Map functionality tests
└── test_messages.py    # Messaging tests
```

---

## Security Considerations

### Frontend Security
- Never store sensitive data in localStorage (only JWT tokens)
- Validate all user inputs before sending to API
- Implement proper CORS handling
- Use HTTPS in production
- Sanitize user-generated content

### Backend Security
- Use environment variables for all secrets
- Implement proper input validation with Pydantic
- Use parameterized queries (SQLAlchemy handles this)
- Implement rate limiting for API endpoints
- Set up proper CORS policies
- Use secure HTTP headers

---

## Performance Targets

### Frontend Performance
- **Initial Load**: < 3 seconds on 3G connection
- **Bundle Size**: < 500KB gzipped for initial chunk
- **Runtime Performance**: 60fps animations, < 100ms response to user input
- **Accessibility**: WCAG 2.1 AA compliance

### Backend Performance
- **API Response Time**: < 200ms for most endpoints
- **Database Queries**: < 50ms for simple queries
- **Concurrent Users**: Support 100+ concurrent users in MVP
- **Memory Usage**: < 512MB RAM for API server

---

## Maintenance Instructions

### Regular Maintenance Tasks
1. **Weekly**: Review new issues added to this document
2. **After Each Feature**: Update improvement roadmap status
3. **Before Major Releases**: Complete security audit
4. **Monthly**: Update dependency versions and test compatibility

### CLAUDE.md Update Protocol
**CRITICAL**: After every significant feature implementation or bug fix session, update this document:

1. **Add New Issues Found**:
   ```markdown
   ### New Issues Discovered (Date: YYYY-MM-DD)
   - **Component**: Brief description
   - **Severity**: Critical/High/Medium/Low
   - **Location**: File paths and line numbers
   - **Impact**: How it affects users/development
   - **Proposed Fix**: Specific action items
   ```

2. **Update Completion Status**:
   - Mark completed items with ✅
   - Update percentage completion for ongoing items
   - Move items between priority levels if needed

3. **Reflect Architecture Changes**:
   - Update file organization if structure changed
   - Modify code quality standards if patterns evolved
   - Add new environment variables or configuration

4. **Performance Impact Assessment**:
   - Note any performance improvements or regressions
   - Update performance targets if requirements changed
   - Document new optimization opportunities

### Version History Tracking
Always add entries to this section when updating:

```markdown
## Document Change History
- **2025-01-31**: Initial comprehensive analysis and roadmap creation
- **2025-08-02**: Phase 2 community features implementation progress
```

---

## Integration with Development Tools

### Claude Code Integration
When working with Claude Code, reference specific sections:
- Link to specific issues: "Fix the hardcoded API URL issue in Frontend Critical Issues #1"
- Reference code standards: "Follow the component export pattern in Code Quality Standards"
- Check completion status: "Mark the CSS standardization task as completed in the roadmap"

### IDE Configuration
Recommended VS Code extensions:
- TypeScript and JavaScript Language Features
- ESLint for code quality
- Prettier for formatting
- Auto Rename Tag for HTML/JSX
- GitLens for git integration

---

## Document Change History
- **2025-01-31**: Initial comprehensive analysis and roadmap creation
- **2025-08-02**: Phase 2 community features implementation progress

---

## Conclusion

This document serves as the living reference for maintaining code quality and tracking technical debt in the Aquarian Gnosis project. It should be consulted before starting any new development work and updated after every significant implementation.

The roadmap is designed to ensure that technical debt is addressed systematically while not blocking feature development. Priority should be given to Critical and High Priority issues before moving to the next development phase.

**Next Major Review**: After Phase 2 completion or when 75% of Critical issues are resolved.

---

*This document was generated through comprehensive codebase analysis and should be treated as the authoritative source for development guidelines and technical debt management.*
