# Documentation Index

Aquarian Gnosis - Gnostic Community Platform

## Quick Reference

| Feature | Doc | Last Updated | Status |
|---------|-----|--------------|--------|
| Admin Dashboard | [admin-dashboard.md](./admin-dashboard.md) | 2026-01-09 | current |
| About Page Review System | [about-review-system.md](./about-review-system.md) | 2026-01-08 | current |
| Community Map | [community-map.md](./community-map.md) | 2026-01-03 | current |
| Product Requirements | [PRD.md](./PRD.md) | 2025-12-30 | reference |

## By Category

### Core Features

- **Admin Dashboard** - [admin-dashboard.md](./admin-dashboard.md)
  - Site statistics and analytics overview
  - User management (activate, promote, delete)
  - Forum moderation (pin threads, delete content)
  - Resource approval queue
  - Files: `client/src/pages/AdminDashboardPage.tsx`, `server/app/api/admin.py`

- **About Page Review System** - [about-review-system.md](./about-review-system.md)
  - Collaborative editing with comments and edit suggestions (Google Docs-style)
  - Text selection with inline highlighting and sidebar annotations
  - Admin accept/reject workflow for content changes
  - Files: `client/src/components/about/`, `server/app/api/about.py`

- **Community Map** - [community-map.md](./community-map.md)
  - Location sharing with visibility controls (public/members/custom)
  - Nearby user discovery with radius filtering
  - GPS, map click, and address search for location input
  - Files: `client/src/components/map/`, `server/app/api/map.py`

### Reference Documents

- **Product Requirements Document** - [PRD.md](./PRD.md)
  - Full project scope and feature specifications
  - Phase breakdown and implementation priorities

## Maintenance Log

- 2026-01-09: Added admin-dashboard.md for site administration feature
- 2026-01-08: Added about-review-system.md for About page collaborative editing feature
- 2026-01-03: Created INDEX.md, added community-map.md for map feature
- 2026-01-03: Indexed existing PRD.md as reference document

## Unindexed Files

Files in docs/ not listed above (review needed):
- (none currently)
