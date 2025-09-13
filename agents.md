# Aquarian Gnosis - Agent Commands & Style Guide

## Build/Lint/Test Commands

### Frontend (client/)
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test` (single test: `npm test -- testNamePattern="pattern"`)
- Test UI: `npm run test:ui`
- Coverage: `npm run coverage`

### Backend (server/)
- Dev server: Use PM2 (`pm2 restart ecosystem.config.js`)
- Lint: Use flake8 or pylint
- Test: `pytest` (single test: `pytest tests/test_file.py::test_name`)
- Migrations: `alembic upgrade head`

## Code Style Guidelines

### Imports & Formatting
- Frontend: ES6 imports, Prettier formatting
- Backend: Standard Python imports, autopep8 formatting

### Types & Naming
- Frontend: TypeScript strict mode, explicit typing
- Backend: Python type hints, snake_case naming
- Components: PascalCase, files: PascalCase.tsx

### Error Handling
- Frontend: Try/catch with user-friendly messages
- Backend: Custom exception classes, proper HTTP status codes

### General Rules
- Use absolute imports (@/ for frontend)
- Environment variables for configuration
- Follow existing code patterns