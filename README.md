# Aquarian Gnosis

A gnostic community platform dedicated to the gnosis of Samael Aun Weor, designed to connect gnostics worldwide from different organizations during the Aquarian era.

## Project Overview

**Website Name:** Aquarian Gnosis  
**Domain:** aquariangnosis.org  
**Purpose:** A unified digital space where gnostics from disparate organizations can connect, share resources, and form study groups regardless of their organizational affiliation or geographic location.

## Core Features

### Completed Features
- **Landing Page**: Beautiful design with gnostic cross navigation
- **User Authentication**: Secure registration and login system
- **Interactive Map**: Community location sharing with privacy controls
- **Messaging System**: Platform-only user communication
- **Community Forum**: Discussion categories, threads, and replies
- **Study Groups**: Group creation and membership management
- **Resource Sharing**: Community-driven content sharing
- **Organizations Directory**: Comprehensive gnostic organization listings

### Technology Stack
- **Frontend**: React with TypeScript, Zustand for state management
- **Backend**: FastAPI (Python) with PostgreSQL database
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Hosting**: Oracle Cloud VM (24GB RAM, 4OCPU ARM)

## Development Status

### Phase 1: MVP Foundation (Complete)
- Landing page with navigation
- User registration and authentication
- Interactive map with location sharing
- Basic messaging system

### Phase 2: Community Foundation (Complete)
- Forum system with categories and discussions
- Study group management and discovery
- Resource sharing platform
- Organizations directory

### Phase 3: Content Management (In Progress)
- Comprehensive resource library
- Multimedia integration
- Learning path system
- Advanced organization features

## Quick Start

1. Install all dependencies:
   ```bash
   npm run install:all
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Project Structure

```
├── client/              # Frontend React application
├── server/              # Backend FastAPI application
├── ecosystem.config.js   # PM2 process configuration
├── setup.sh             # Initial setup script
└── run.sh               # Application start script
```

## Documentation

- [Project Plan](PROJECT_PLAN.md) - Detailed implementation roadmap
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Phase-by-phase development guide
- [CLAUDE.md](CLAUDE.md) - Development guidelines and technical debt tracking
- [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) - Environment configuration guide

## Testing

Run all tests:
```bash
npm test
```

## License

MIT License - See LICENSE file for details
# Webhook Test
