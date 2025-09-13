# Aquarian Gnosis Frontend

Frontend application for the Aquarian Gnosis community platform built with React, TypeScript, and Vite.

## Features Implemented

### Core Features
- Interactive landing page with gnostic cross navigation
- User authentication system
- Community map with location sharing
- Messaging system between users

### Phase 2 Community Features
- **Forum System**: Discussion categories and threads
- **Study Groups**: Group creation and membership management
- **Resource Sharing**: Community-driven content sharing
- **Organizations Directory**: Listing of gnostic organizations

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── stores/         # Zustand state management
├── services/       # API communication layer
├── types/          # TypeScript type definitions
└── styles/         # CSS stylesheets
```

## Environment Variables

Create a `.env.local` file in the client directory with:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Testing

Run frontend tests with:
```bash
npm test
```

Or for UI testing:
```bash
npm run test:ui
```

## Dependencies

- React 18 with TypeScript
- Zustand for state management
- Axios for API communication
- Leaflet.js for mapping
- React Router DOM for navigation
