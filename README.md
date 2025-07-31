# Aquarian Gnosis

A gnostic community platform for connecting seekers worldwide, dedicated to the teachings of Samael Aun Weor and uniting gnostics across different organizations in the Aquarian Age.

## Overview

Aquarian Gnosis is a comprehensive web platform designed to bridge the gaps between disparate gnostic organizations and practitioners. The platform enables gnostics to connect, share resources, form study groups, and build a unified global community while respecting the diversity of different schools and approaches to gnosis.

## ✅ Phase 1 MVP - Complete

The **Phase 1 MVP** is now **complete** and includes all core functionality:

### 🎯 Implemented Features

- **🔐 Complete Authentication System**
  - User registration with validation
  - JWT-based secure login/logout
  - Profile management
  - Session persistence

- **🗺️ Interactive Community Map**  
  - Leaflet.js integration with OpenStreetMap
  - User location sharing with privacy controls
  - Geolocation support and manual coordinate entry
  - Discovery of nearby gnostics
  - Location status (permanent, traveling, nomadic)
  - Public/private location visibility settings

- **💬 Platform Messaging System**
  - Real-time user-to-user messaging
  - Conversation management
  - Read/unread message tracking
  - Platform-only communication (privacy-first)
  - Message threading and history

- **🏠 Beautiful Landing Page**
  - Interactive Gnostic Cross navigation
  - Banyan tree sacred background
  - Responsive design across all devices
  - Section previews and navigation

- **⚙️ Robust Backend Architecture**
  - FastAPI REST API with full documentation
  - PostgreSQL database with proper schemas
  - Secure password hashing and JWT tokens
  - Input validation and error handling
  - Modular, scalable codebase

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Zustand** for state management  
- **Leaflet.js** for interactive maps
- **CSS3** with custom responsive design
- **Vite** for fast development

### Backend
- **FastAPI** (Python) with async support
- **PostgreSQL** database
- **SQLAlchemy** ORM with Alembic migrations
- **JWT** authentication with bcrypt hashing
- **Pydantic** for data validation

### Infrastructure
- Designed for **Oracle Cloud ARM** deployment
- **Docker** ready configuration
- **Redis** ready for future caching
- Modular architecture for easy scaling

## 📁 Project Structure

```
AquarianGnosis/
├── client/                     # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── auth/          # Authentication forms
│   │   │   ├── landing/       # Landing page components
│   │   │   ├── map/           # Map and location components
│   │   │   └── messaging/     # Messaging system components
│   │   ├── pages/             # Main page components
│   │   ├── stores/            # Zustand state management
│   │   ├── services/          # API communication layer
│   │   ├── types/             # TypeScript type definitions
│   │   └── styles/            # CSS styling
│   └── public/assets/         # Static assets (banyan.jpg)
├── server/                     # FastAPI Python backend
│   ├── app/
│   │   ├── api/               # API route handlers
│   │   ├── core/              # Core configuration and database
│   │   ├── models/            # SQLAlchemy database models
│   │   └── schemas/           # Pydantic data schemas
│   ├── init_db.py            # Database initialization script
│   └── requirements.txt       # Python dependencies
├── PROJECT_PLAN.md            # Comprehensive feature specifications
├── IMPLEMENTATION_PLAN.md     # 5-phase development roadmap
└── DEVELOPMENT_SETUP.md       # Developer setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.9+, PostgreSQL 12+

### 1. Clone and Setup
```bash
git clone <repository-url>
cd AquarianGnosis
npm run install:all  # Installs all dependencies
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb aquarian_gnosis

# Initialize database schema
cd server
python init_db.py
```

### 3. Start the Application
```bash
# Option 1: PM2 (recommended for testing)
npm run pm2:start

# Option 2: Direct script
./run.sh

# Option 3: Development mode
npm run dev
```

### 4. Validate Setup (Optional)
```bash
./validate.sh  # Check if everything is configured correctly
```

## 🛠️ Available Scripts

### Setup & Validation
- `./setup.sh` - Automated setup of dependencies and database
- `./validate.sh` - Validate system requirements and configuration

### Running the Application
- `./run.sh` - Start both frontend and backend servers
- `npm run dev` - Development mode with hot reload
- `npm run pm2:start` - Start with PM2 process manager
- `npm run pm2:stop` - Stop PM2 processes
- `npm run pm2:restart` - Restart PM2 processes
- `npm run pm2:logs` - View PM2 logs
- `npm run pm2:status` - Check PM2 process status

### Development
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production
- `npm run test` - Run all tests

## 🌟 Key Features in Action

### Interactive Community Map
- **Find gnostics worldwide** with distance-based discovery
- **Privacy-first approach** with granular location sharing controls
- **Real-time geolocation** with manual coordinate support
- **Status indicators** for permanent residents, travelers, and nomads

### Secure Messaging Platform
- **End-to-end platform security** with no external contact sharing
- **Conversation management** with read receipts and history
- **User discovery** integration with the community map
- **Mobile-responsive** messaging interface

### Sacred Design Elements
- **Gnostic Cross navigation** - central sacred symbol as interactive UI
- **Banyan Tree background** - symbolizing wisdom and spiritual growth
- **Transparent aesthetics** - representing clarity and truth
- **Responsive design** - accessible across all devices and screen sizes

## 🗺️ Future Phases

The platform is designed for continuous expansion:

- **Phase 2** (Weeks 9-16): Enhanced community features, forums, study groups
- **Phase 3** (Weeks 17-26): Comprehensive resource library, multimedia content
- **Phase 4** (Weeks 27-36): Advanced networking, mentorship, trust systems  
- **Phase 5** (Weeks 37-48): International support, AI features, governance

## 📊 Current Status

**✅ Phase 1 MVP: COMPLETE**
All core functionality implemented and ready for deployment:
- User authentication ✅
- Interactive map with location sharing ✅  
- Platform messaging system ✅
- Beautiful responsive UI ✅
- Robust backend API ✅

**🎯 Ready for User Testing**  
The platform is ready for beta users to register, add their locations, and start connecting with the global gnostic community.

## 🤝 Contributing

This project follows a modular architecture designed for long-term expansion. Each component is carefully separated for easy maintenance and feature addition.

### Development Guidelines
- **Modular Design**: Every feature is self-contained
- **TypeScript Strict**: Full type safety throughout
- **API-First**: Strong backend API with comprehensive documentation
- **Privacy by Design**: User data protection at every level
- **Mobile-First**: Responsive design for all screen sizes

## 📄 Documentation

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Complete technical specifications and feature requirements
- **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - 5-phase development roadmap with timelines  
- **[DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)** - Developer environment setup guide

## 🌍 Mission

To create a unified digital sanctuary where gnostics from all traditions can connect, learn, and grow together in the Aquarian Age - transcending organizational boundaries while honoring the diversity of paths to gnosis.

---

*"In this confusing world of spirituality and religion, Gnosis can serve as a beacon of light which unites all perspectives into one cohesive whole."*
