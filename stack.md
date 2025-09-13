- **Frontend**: React + TypeScript + Vite + Tailwind (mobile-first design)
- **Backend**: FastAPI (async, gzip, caching headers, structured logging with structlog)
- **Database**: PostgreSQL (store metadata, user state, points)
- **PWA**: Service worker with vite-plugin-pwa
- **Process Manager**: PM2 for both frontend and backend
- Infra: CDN + Redis + Worker (Celery/APScheduler) + Service Worker + SSR
Database migrations with Alembic
