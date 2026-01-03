# Product Requirements Document (PRD)
# Aquarian Gnosis - Gnostic Community Platform

**Version**: 1.0
**Date**: December 30, 2025
**Status**: Phase 2 Complete, Phase 3 Planning
**Document Owner**: Project Lead

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Mission](#2-product-vision--mission)
3. [Target Users & Personas](#3-target-users--personas)
4. [Problem Statement](#4-problem-statement)
5. [Product Goals & Success Metrics](#5-product-goals--success-metrics)
6. [Feature Requirements](#6-feature-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [User Stories & Use Cases](#8-user-stories--use-cases)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Development Roadmap](#10-development-roadmap)
11. [Risk Assessment](#11-risk-assessment)
12. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Overview

Aquarian Gnosis is a community platform designed to connect seekers of Samael Aun Weor's gnostic teachings worldwide. The platform transcends organizational boundaries, providing a neutral space where students from any gnostic institution—or none at all—can connect, share resources, and form study groups.

### 1.2 Current Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Core Infrastructure (Auth, Map, Messaging) |
| Phase 2 | ✅ Complete | Community Foundation (Forums, Study Groups, Resources) |
| Phase 3 | 🔲 Planning | Advanced Features (Events, Video, Moderation) |
| Phase 4 | 🔲 Future | Scale & Monetization |

### 1.3 Key Metrics (Targets)

- **Year 1 MAU**: 1,000+ monthly active users
- **Community Engagement**: 50+ active study groups
- **Resource Library**: 500+ shared resources
- **Geographic Reach**: Users in 50+ countries

---

## 2. Product Vision & Mission

### 2.1 Vision Statement

> *"To create the definitive digital gathering place for gnostic students worldwide, fostering unity among seekers regardless of their organizational affiliation."*

### 2.2 Mission Statement

Aquarian Gnosis exists to:

1. **Connect** scattered gnostic practitioners through geographic discovery
2. **Unite** students across organizational boundaries in shared study
3. **Preserve** and disseminate authentic gnostic teachings
4. **Empower** local communities to form and grow organically
5. **Facilitate** meaningful spiritual discourse and resource sharing

### 2.3 Core Values

| Value | Description |
|-------|-------------|
| **Unity** | One gnostic family regardless of institutional affiliation |
| **Authenticity** | Faithful to Samael Aun Weor's original teachings |
| **Accessibility** | Free and open to all sincere seekers |
| **Privacy** | User data protection as a fundamental right |
| **Community-Driven** | Features shaped by user needs |

### 2.4 Positioning Statement

**For** students of gnosis seeking connection with fellow practitioners,
**Who** lack a unified platform to discover nearby gnostics and share resources,
**Aquarian Gnosis** is a community platform
**That** connects practitioners worldwide through interactive mapping, forums, and study groups,
**Unlike** organization-specific websites or general social media,
**Our product** prioritizes spiritual community over institutional boundaries.

---

## 3. Target Users & Personas

### 3.1 Primary User Personas

#### Persona 1: The Seeking Student

| Attribute | Description |
|-----------|-------------|
| **Name** | Maria (28, Brazil) |
| **Background** | Recently discovered Samael's books, studying independently |
| **Goals** | Find local study group, connect with experienced practitioners |
| **Pain Points** | Isolated study, no local gnostic center, language barriers |
| **Usage Pattern** | Weekly forum visits, active resource consumer |
| **Key Features** | Map discovery, study groups, resource library |

#### Persona 2: The Experienced Practitioner

| Attribute | Description |
|-----------|-------------|
| **Name** | David (52, USA) |
| **Background** | 20+ years in gnosis, former missionary instructor |
| **Goals** | Share knowledge, mentor newcomers, maintain community |
| **Pain Points** | Organizational politics, scattered community, lost connections |
| **Usage Pattern** | Daily forum activity, study group leader |
| **Key Features** | Forum creation, study group management, messaging |

#### Persona 3: The Traveling Seeker

| Attribute | Description |
|-----------|-------------|
| **Name** | Andres (35, Spain/Global) |
| **Background** | Digital nomad, attended gnostic centers worldwide |
| **Goals** | Find gnostics in new cities, maintain connections |
| **Pain Points** | Finding communities while traveling, maintaining relationships |
| **Usage Pattern** | Location updates, message-heavy usage |
| **Key Features** | Interactive map, nomadic status, messaging |

#### Persona 4: The Independent Scholar

| Attribute | Description |
|-----------|-------------|
| **Name** | Anna (45, Germany) |
| **Background** | Academic interest in esotericism, studies gnosis comparatively |
| **Goals** | Access original texts, understand teachings, scholarly discussion |
| **Pain Points** | Finding authentic materials, distinguishing interpretations |
| **Usage Pattern** | Resource consumer, occasional forum contributor |
| **Key Features** | Resource library, books section, academic discussions |

### 3.2 Secondary Users

- **Organization Administrators**: Want to list their centers and reach students
- **Content Creators**: Produce gnostic educational content (video, audio, blogs)
- **Translators**: Work on making materials available in multiple languages

### 3.3 User Demographics

| Demographic | Estimated Distribution |
|-------------|----------------------|
| **Age Range** | 25-55 years (primary), 18-70 (total) |
| **Gender** | 55% Male, 45% Female |
| **Geographic** | Latin America (40%), Europe (30%), North America (20%), Other (10%) |
| **Languages** | Spanish (40%), English (35%), Portuguese (15%), Other (10%) |
| **Tech Savvy** | Moderate to high digital literacy |

---

## 4. Problem Statement

### 4.1 Current State Analysis

The gnostic community faces several interconnected challenges:

#### Fragmentation Problem
```
┌─────────────────────────────────────────────────────────────────┐
│                    CURRENT GNOSTIC LANDSCAPE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Glorian  │    │  Koradi  │    │   GMSP   │    │ Regional │  │
│  │ Students │    │ Students │    │ Students │    │  Centers │  │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘  │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Isolated │    │ Isolated │    │ Isolated │    │ Isolated │  │
│  │Community │    │Community │    │Community │    │Community │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                                                                   │
│           NO CROSS-ORGANIZATION COMMUNICATION                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Problems

| Problem | Impact | Severity |
|---------|--------|----------|
| **Geographic Isolation** | Students cannot find nearby practitioners | High |
| **Organizational Silos** | Cross-institution communication is rare | High |
| **Resource Fragmentation** | Books, lectures, content scattered across sites | Medium |
| **No Neutral Ground** | Political divisions prevent unity | High |
| **Discovery Barrier** | New seekers struggle to find authentic community | High |

### 4.2 Desired State

```
┌─────────────────────────────────────────────────────────────────┐
│                   AQUARIAN GNOSIS SOLUTION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                     ┌────────────────┐                           │
│                     │   AQUARIAN     │                           │
│                     │    GNOSIS      │                           │
│                     │   PLATFORM     │                           │
│                     └───────┬────────┘                           │
│                             │                                     │
│         ┌───────────────────┼───────────────────┐                │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐           │
│  │  UNIFIED   │     │   SHARED   │     │   CROSS-   │           │
│  │    MAP     │     │  RESOURCES │     │   ORG      │           │
│  │ Discovery  │     │   Library  │     │  FORUMS    │           │
│  └────────────┘     └────────────┘     └────────────┘           │
│         │                   │                   │                │
│         └───────────────────┼───────────────────┘                │
│                             ▼                                     │
│                    ┌────────────────┐                            │
│                    │  UNIFIED       │                            │
│                    │  GNOSTIC       │                            │
│                    │  COMMUNITY     │                            │
│                    └────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Product Goals & Success Metrics

### 5.1 Strategic Goals

| Goal | Description | Timeline |
|------|-------------|----------|
| **G1: Community Building** | Establish the primary online gathering space for gnostics | Year 1 |
| **G2: Geographic Connection** | Enable discovery of nearby practitioners in 80% of major cities | Year 2 |
| **G3: Knowledge Preservation** | Create comprehensive resource library | Ongoing |
| **G4: Study Group Formation** | Facilitate organic formation of local study groups | Year 1-2 |

### 5.2 Key Performance Indicators (KPIs)

#### User Acquisition & Retention

| Metric | Year 1 Target | Year 2 Target | Measurement |
|--------|---------------|---------------|-------------|
| Total Registered Users | 2,500 | 10,000 | Database count |
| Monthly Active Users (MAU) | 1,000 | 5,000 | Monthly unique logins |
| Weekly Active Users (WAU) | 400 | 2,000 | Weekly unique logins |
| User Retention (30-day) | 40% | 50% | Return rate |
| User Retention (90-day) | 25% | 35% | Return rate |

#### Engagement Metrics

| Metric | Year 1 Target | Year 2 Target | Measurement |
|--------|---------------|---------------|-------------|
| Forum Posts/Month | 500 | 2,000 | Monthly post count |
| Messages Sent/Month | 1,000 | 5,000 | Monthly message count |
| Study Groups Created | 50 | 200 | Total groups |
| Active Study Groups | 30 | 100 | Groups with activity in 30 days |
| Resources Shared | 500 | 2,000 | Total approved resources |

#### Geographic Metrics

| Metric | Year 1 Target | Year 2 Target | Measurement |
|--------|---------------|---------------|-------------|
| Countries Represented | 30 | 50 | Unique user locations |
| Map Locations Shared | 500 | 2,000 | Public location count |
| Location-Based Connections | 100 | 500 | Messages from map discovery |

### 5.3 Success Criteria by Phase

#### Phase 2 Success Criteria (Current - ✅ Complete)

- [x] Forum system operational with categories and threading
- [x] Study group creation and management functional
- [x] Resource sharing with voting system
- [x] Organizations directory complete
- [x] All API endpoints tested and stable

#### Phase 3 Success Criteria (Upcoming)

- [ ] Event system with calendar integration
- [ ] Video content streaming or embedding
- [ ] Advanced moderation tools
- [ ] Search across all content types
- [ ] Mobile app or PWA optimization

---

## 6. Feature Requirements

### 6.1 Feature Summary Matrix

| Feature | Phase | Priority | Status | Users Impacted |
|---------|-------|----------|--------|----------------|
| User Authentication | 1 | Critical | ✅ Complete | All |
| Interactive Map | 1 | Critical | ✅ Complete | All |
| Messaging System | 1 | High | ✅ Complete | All |
| Forum System | 2 | Critical | ✅ Complete | All |
| Study Groups | 2 | High | ✅ Complete | All |
| Resource Sharing | 2 | High | ✅ Complete | All |
| Organizations Directory | 2 | Medium | ✅ Complete | All |
| Events Calendar | 3 | High | 🔲 Planned | All |
| Video Integration | 3 | Medium | 🔲 Planned | Content Creators |
| Moderation Tools | 3 | High | 🔲 Planned | Moderators |
| Search System | 3 | High | 🔲 Planned | All |
| Mobile App | 4 | Medium | 🔲 Future | Mobile Users |

### 6.2 Detailed Feature Specifications

---

#### Feature 6.2.1: User Authentication System

**Status**: ✅ Complete

**Description**: Secure user registration, login, and session management system enabling platform access and identity management.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AUTH-001 | Users can register with email/password | Critical | ✅ |
| AUTH-002 | Users can login with credentials | Critical | ✅ |
| AUTH-003 | JWT token-based session management | Critical | ✅ |
| AUTH-004 | Password reset functionality | High | 🔲 |
| AUTH-005 | Email verification | High | 🔲 |
| AUTH-006 | OAuth integration (Google, etc.) | Low | 🔲 |

**API Endpoints**:
```
POST /api/v1/auth/register    - Create new account
POST /api/v1/auth/login       - Authenticate user
GET  /api/v1/auth/me          - Get current user
POST /api/v1/auth/logout      - End session
```

**Data Model**:
```
User {
  id: UUID (PK)
  username: String (unique)
  email: String (unique)
  password_hash: String
  is_verified: Boolean
  is_active: Boolean
  created_at: DateTime
  updated_at: DateTime
}
```

---

#### Feature 6.2.2: Interactive Map System

**Status**: ✅ Complete

**Description**: Global map interface allowing users to share their location and discover nearby gnostic practitioners.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| MAP-001 | Display OpenStreetMap tiles | Critical | ✅ |
| MAP-002 | Users can add their location | Critical | ✅ |
| MAP-003 | Privacy controls for location | Critical | ✅ |
| MAP-004 | View public user locations | Critical | ✅ |
| MAP-005 | Location status (permanent/traveling/nomadic) | High | ✅ |
| MAP-006 | Nearby user discovery with radius | High | ✅ |
| MAP-007 | Map statistics endpoint | Medium | ✅ |
| MAP-008 | Click-to-message from map markers | Medium | ✅ |
| MAP-009 | Cluster markers at zoom levels | Low | 🔲 |

**API Endpoints**:
```
POST   /api/v1/map/location          - Add location
GET    /api/v1/map/location          - Get own location
PUT    /api/v1/map/location          - Update location
DELETE /api/v1/map/location          - Remove location
GET    /api/v1/map/locations/public  - Get all public locations
GET    /api/v1/map/locations/nearby  - Get nearby users
GET    /api/v1/map/stats             - Map statistics
```

**Data Model**:
```
UserLocation {
  id: UUID (PK)
  user_id: UUID (FK -> User)
  latitude: Decimal
  longitude: Decimal
  is_public: Boolean
  status: Enum (permanent, traveling, nomadic)
  created_at: DateTime
  updated_at: DateTime
}
```

**Privacy Levels**:
- `public`: Visible to all users
- `local_area`: Visible within region only
- `authenticated`: Visible to logged-in users only
- `study_group`: Visible to study group members only

---

#### Feature 6.2.3: Messaging System

**Status**: ✅ Complete

**Description**: Private one-to-one messaging between users enabling community connections.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| MSG-001 | Send private messages to users | Critical | ✅ |
| MSG-002 | View conversation history | Critical | ✅ |
| MSG-003 | List all conversations | Critical | ✅ |
| MSG-004 | Mark messages as read | High | ✅ |
| MSG-005 | Delete messages | Medium | ✅ |
| MSG-006 | Real-time message delivery | Medium | 🔲 |
| MSG-007 | Message notifications | Medium | 🔲 |
| MSG-008 | Block/report users | Low | 🔲 |

**API Endpoints**:
```
POST /api/v1/messages/send           - Send message
GET  /api/v1/messages/conversations  - List conversations
GET  /api/v1/messages/with/{user_id} - Get thread with user
PUT  /api/v1/messages/{id}/read      - Mark as read
DELETE /api/v1/messages/{id}         - Delete message
```

**Data Model**:
```
Message {
  id: UUID (PK)
  sender_id: UUID (FK -> User)
  recipient_id: UUID (FK -> User)
  content: Text
  is_read: Boolean
  created_at: DateTime
}
```

---

#### Feature 6.2.4: Forum System

**Status**: ✅ Complete

**Description**: Community discussion forums organized by categories with threaded conversations and voting.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FRM-001 | Forum categories with descriptions | Critical | ✅ |
| FRM-002 | Create discussion threads | Critical | ✅ |
| FRM-003 | Reply to threads | Critical | ✅ |
| FRM-004 | Nested/threaded replies | High | ✅ |
| FRM-005 | Upvote/downvote threads | High | ✅ |
| FRM-006 | Upvote/downvote replies | High | ✅ |
| FRM-007 | Pin important threads | Medium | ✅ |
| FRM-008 | Edit own posts | Medium | ✅ |
| FRM-009 | Delete own posts | Medium | ✅ |
| FRM-010 | Category-based filtering | High | ✅ |
| FRM-011 | Search within forums | Medium | 🔲 |
| FRM-012 | Markdown formatting | Low | 🔲 |

**API Endpoints**:
```
GET    /api/v1/forum/categories                    - List categories
POST   /api/v1/forum/categories                    - Create category
PUT    /api/v1/forum/categories/{id}               - Update category
DELETE /api/v1/forum/categories/{id}               - Delete category
GET    /api/v1/forum/categories/{id}/threads       - Get threads
POST   /api/v1/forum/threads                       - Create thread
GET    /api/v1/forum/threads/{id}                  - Get thread
PUT    /api/v1/forum/threads/{id}                  - Update thread
DELETE /api/v1/forum/threads/{id}                  - Delete thread
GET    /api/v1/forum/threads/{id}/replies          - Get replies
POST   /api/v1/forum/replies                       - Create reply
PUT    /api/v1/forum/replies/{id}                  - Update reply
DELETE /api/v1/forum/replies/{id}                  - Delete reply
POST   /api/v1/forum/threads/{id}/vote             - Vote thread
POST   /api/v1/forum/replies/{id}/vote             - Vote reply
```

**Data Models**:
```
ForumCategory {
  id: UUID (PK)
  name: String
  description: Text
  display_order: Integer
  created_at: DateTime
}

ForumThread {
  id: UUID (PK)
  category_id: UUID (FK -> ForumCategory)
  author_id: UUID (FK -> User)
  title: String
  content: Text
  upvotes: Integer
  downvotes: Integer
  is_pinned: Boolean
  created_at: DateTime
  updated_at: DateTime
}

ForumReply {
  id: UUID (PK)
  thread_id: UUID (FK -> ForumThread)
  author_id: UUID (FK -> User)
  parent_reply_id: UUID (FK -> ForumReply, nullable)
  content: Text
  upvotes: Integer
  downvotes: Integer
  created_at: DateTime
}
```

**Suggested Forum Categories**:
1. General Discussion
2. The Three Factors
3. Dream Yoga & Astral
4. Alchemy & Transmutation
5. Meditation & Practices
6. Book Study
7. Questions & Answers
8. Introductions
9. Regional Gatherings
10. Announcements

---

#### Feature 6.2.5: Study Group System

**Status**: ✅ Complete

**Description**: System for creating and managing study groups with role-based membership.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| STG-001 | Create study groups | Critical | ✅ |
| STG-002 | Join/leave groups | Critical | ✅ |
| STG-003 | Role system (admin/mod/member) | High | ✅ |
| STG-004 | Public/private group visibility | High | ✅ |
| STG-005 | Member limit configuration | Medium | ✅ |
| STG-006 | Location-based groups | Medium | ✅ |
| STG-007 | Group description/details | High | ✅ |
| STG-008 | Member management (kick/promote) | Medium | ✅ |
| STG-009 | Group-specific chat | Low | 🔲 |
| STG-010 | Study schedule integration | Low | 🔲 |

**API Endpoints**:
```
GET    /api/v1/study-groups                        - List groups
POST   /api/v1/study-groups                        - Create group
GET    /api/v1/study-groups/{id}                   - Get group
PUT    /api/v1/study-groups/{id}                   - Update group
DELETE /api/v1/study-groups/{id}                   - Delete group
GET    /api/v1/study-groups/{id}/members           - Get members
POST   /api/v1/study-groups/{id}/join              - Join group
PUT    /api/v1/study-groups/{id}/members/{mid}     - Update member
DELETE /api/v1/study-groups/{id}/members/{mid}     - Remove member
```

**Data Models**:
```
StudyGroup {
  id: UUID (PK)
  name: String
  description: Text
  creator_id: UUID (FK -> User)
  is_location_based: Boolean
  max_members: Integer
  is_public: Boolean
  created_at: DateTime
}

StudyGroupMember {
  id: UUID (PK)
  group_id: UUID (FK -> StudyGroup)
  user_id: UUID (FK -> User)
  role: Enum (member, moderator, admin)
  joined_at: DateTime
}
```

---

#### Feature 6.2.6: Resource Sharing System

**Status**: ✅ Complete

**Description**: Community-curated library of gnostic resources including books, videos, audio, blogs, and art.

**Functional Requirements**:

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RES-001 | Submit resources with URL | Critical | ✅ |
| RES-002 | Resource type categorization | Critical | ✅ |
| RES-003 | Upvote/downvote resources | High | ✅ |
| RES-004 | Resource descriptions | High | ✅ |
| RES-005 | Filter by resource type | High | ✅ |
| RES-006 | Approval workflow | Medium | ✅ |
| RES-007 | Edit own submissions | Medium | ✅ |
| RES-008 | Delete own submissions | Medium | ✅ |
| RES-009 | Search resources | Medium | 🔲 |
| RES-010 | Resource thumbnails | Low | 🔲 |

**Resource Types**:
- `blogs` - Gnostic websites and blogs
- `books` - Samael's works and related literature
- `video` - Educational video content
- `audio` - Lectures and audio teachings
- `art` - Sacred images and religious artwork

**API Endpoints**:
```
GET    /api/v1/resources               - List resources
POST   /api/v1/resources               - Submit resource
GET    /api/v1/resources/{id}          - Get resource
PUT    /api/v1/resources/{id}          - Update resource
DELETE /api/v1/resources/{id}          - Delete resource
POST   /api/v1/resources/{id}/vote     - Vote on resource
```

**Data Model**:
```
SharedResource {
  id: UUID (PK)
  title: String
  url: String
  description: Text
  resource_type: Enum (blogs, books, video, audio, art)
  submitted_by: UUID (FK -> User)
  upvotes: Integer
  downvotes: Integer
  is_approved: Boolean
  created_at: DateTime
}
```

---

#### Feature 6.2.7: Organizations Directory

**Status**: ✅ Complete

**Description**: Directory of gnostic organizations worldwide for reference and discovery.

**Categories**:

| Category | Description | Examples |
|----------|-------------|----------|
| **Major Organizations** | International gnostic institutions | Glorian Publishing, Koradi Institute, AGEAC |
| **Regional Centers** | Local study centers and lumisials | Regional chapters worldwide |
| **Independent Groups** | Unaffiliated study circles | Independent practitioners |

**Static Content** (no database, curated list).

---

#### Feature 6.2.8: Events Calendar (Phase 3)

**Status**: 🔲 Planned

**Description**: System for creating and discovering gnostic events, retreats, and gatherings.

**Planned Requirements**:

| ID | Requirement | Priority |
|----|-------------|----------|
| EVT-001 | Create events with date/time/location | High |
| EVT-002 | RSVP/attendance tracking | High |
| EVT-003 | Calendar view of events | High |
| EVT-004 | Event notifications/reminders | Medium |
| EVT-005 | Recurring events | Medium |
| EVT-006 | Integration with external calendars | Low |

---

#### Feature 6.2.9: Search System (Phase 3)

**Status**: 🔲 Planned

**Description**: Unified search across all content types.

**Planned Scope**:
- Forum threads and replies
- Study groups
- Resources
- Users (optional, privacy-respecting)
- Events

---

### 6.3 User Interface Specifications

#### Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Aquarian Gnosis            Resources | Map | Login      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    ╔═══════════════════╗                         │
│                    ║   AQUARIAN        ║                         │
│                    ║    GNOSIS         ║                         │
│                    ╚═══════════════════╝                         │
│                                                                   │
│                   "Connecting Gnostic Seekers                    │
│                        Worldwide"                                 │
│                                                                   │
│                     [Gnostic Cross]                              │
│                          ↑                                        │
│                       Resources                                   │
│                    ←            →                                 │
│                  Map    ╬    Organizations                       │
│                          ↓                                        │
│                       Community                                   │
│                                                                   │
│              "Whosoever knows, the word gives power              │
│                  to no one. No one knew it..."                   │
│                    - Samael Aun Weor                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

#### Navigation Structure

```
Main Navigation
├── Landing (/)
├── Map (/map)
│   └── Location Manager
├── Community (/community)
│   ├── Tab: Forum
│   │   ├── Categories
│   │   ├── Threads
│   │   └── Thread Detail
│   └── Tab: Study Groups
│       ├── Group List
│       └── Group Detail
├── Resources (/resources)
│   ├── Tab: Blogs
│   ├── Tab: Books
│   ├── Tab: Video
│   ├── Tab: Audio
│   └── Tab: Art
├── Organizations (/organizations)
│   ├── Tab: Major
│   ├── Tab: Regional
│   └── Tab: Independent
├── Messages (/messages)
│   ├── Conversation List
│   └── Message Thread
├── Auth (/auth)
│   ├── Login
│   └── Register
└── Video (/video) [Placeholder]
```

---

## 7. Technical Architecture

### 7.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   React Frontend                            │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │ │
│  │  │ Pages   │  │ Stores  │  │Services │  │  Types  │       │ │
│  │  │ (Views) │  │(Zustand)│  │  (API)  │  │  (TS)   │       │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                          HTTPS                                   │
│                              ▼                                    │
├─────────────────────────────────────────────────────────────────┤
│                         API TIER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    FastAPI Backend                          │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │ │
│  │  │  Routes │  │ Schemas │  │ Models  │  │  Core   │       │ │
│  │  │  (API)  │  │(Pydantic│  │(SQLAlch)│  │(Config) │       │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
├─────────────────────────────────────────────────────────────────┤
│                        DATA TIER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │  PostgreSQL  │         │    Redis     │                      │
│  │  (Primary)   │         │   (Cache)    │                      │
│  └──────────────┘         └──────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Technology Stack

#### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.1.0 |
| Language | TypeScript | 5.8.3 |
| Build Tool | Vite | 7.0.4 |
| State Management | Zustand | 4.5.7 |
| Routing | React Router DOM | Latest |
| HTTP Client | Axios | 1.11.0 |
| Maps | Leaflet.js | 1.9.4 |
| Styling | CSS Modules + Tailwind CSS | 4.1.13 |
| PWA | Workbox | Latest |
| Testing | Vitest + Testing Library | Latest |

#### Backend

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.115.0 |
| Language | Python | 3.9+ |
| ORM | SQLAlchemy | 2.0.36 |
| Migrations | Alembic | 1.14.0 |
| Database | PostgreSQL | 13+ |
| Cache | Redis | 5.2.0 |
| Auth | python-jose (JWT) | Latest |
| Server | Uvicorn | 0.32.0 |
| Logging | structlog | 24.4.0 |
| Scheduler | APScheduler | 3.10.4 |
| Testing | pytest | 8.3.3 |

#### Infrastructure

| Component | Technology |
|-----------|-----------|
| Process Management | PM2 |
| Hosting | Oracle Cloud (24GB RAM, 4 ARM OCPU) |
| SSL | Let's Encrypt |
| Domain | aquariangnosis.org |
| CI/CD | GitHub Webhook |

### 7.3 Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE SCHEMA                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐                                                │
│  │    users     │                                                │
│  ├──────────────┤                                                │
│  │ id (PK)      │◄───────────────────────────┐                   │
│  │ username     │                            │                   │
│  │ email        │                            │                   │
│  │ password_hash│                            │                   │
│  │ is_verified  │                            │                   │
│  │ is_active    │                            │                   │
│  │ created_at   │                            │                   │
│  │ updated_at   │                            │                   │
│  └──────────────┘                            │                   │
│         │                                     │                   │
│         │ 1:1                                 │                   │
│         ▼                                     │                   │
│  ┌──────────────┐                            │                   │
│  │user_locations│     ┌──────────────┐       │                   │
│  ├──────────────┤     │   messages   │       │                   │
│  │ id (PK)      │     ├──────────────┤       │                   │
│  │ user_id (FK) │     │ id (PK)      │       │                   │
│  │ latitude     │     │ sender_id(FK)│───────┤                   │
│  │ longitude    │     │recipient_id  │───────┤                   │
│  │ is_public    │     │ content      │       │                   │
│  │ status       │     │ is_read      │       │                   │
│  │ created_at   │     │ created_at   │       │                   │
│  └──────────────┘     └──────────────┘       │                   │
│                                               │                   │
│  ┌──────────────┐     ┌──────────────┐       │                   │
│  │forum_categs  │     │forum_threads │       │                   │
│  ├──────────────┤     ├──────────────┤       │                   │
│  │ id (PK)      │◄────│ category_id  │       │                   │
│  │ name         │     │ id (PK)      │       │                   │
│  │ description  │     │ author_id(FK)│───────┤                   │
│  │ display_order│     │ title        │       │                   │
│  │ created_at   │     │ content      │       │                   │
│  └──────────────┘     │ upvotes      │       │                   │
│                       │ downvotes    │       │                   │
│                       │ is_pinned    │       │                   │
│                       └──────────────┘       │                   │
│                              │               │                   │
│                              │ 1:N           │                   │
│                              ▼               │                   │
│                       ┌──────────────┐       │                   │
│                       │forum_replies │       │                   │
│                       ├──────────────┤       │                   │
│                       │ id (PK)      │       │                   │
│                       │ thread_id(FK)│       │                   │
│                       │ author_id(FK)│───────┤                   │
│                       │parent_reply  │       │                   │
│                       │ content      │       │                   │
│                       │ upvotes      │       │                   │
│                       │ downvotes    │       │                   │
│                       └──────────────┘       │                   │
│                                               │                   │
│  ┌──────────────┐     ┌──────────────────┐   │                   │
│  │study_groups  │     │study_group_members│  │                   │
│  ├──────────────┤     ├──────────────────┤   │                   │
│  │ id (PK)      │◄────│ group_id (FK)    │   │                   │
│  │ name         │     │ id (PK)          │   │                   │
│  │ description  │     │ user_id (FK)     │───┤                   │
│  │ creator_id   │─────│ role             │   │                   │
│  │is_location   │     │ joined_at        │   │                   │
│  │ max_members  │     └──────────────────┘   │                   │
│  │ is_public    │                            │                   │
│  └──────────────┘                            │                   │
│                                               │                   │
│  ┌──────────────┐                            │                   │
│  │shared_resrcs │                            │                   │
│  ├──────────────┤                            │                   │
│  │ id (PK)      │                            │                   │
│  │ title        │                            │                   │
│  │ url          │                            │                   │
│  │ description  │                            │                   │
│  │resource_type │                            │                   │
│  │submitted_by  │────────────────────────────┘                   │
│  │ upvotes      │                                                │
│  │ downvotes    │                                                │
│  │ is_approved  │                                                │
│  └──────────────┘                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 API Design

**Base URL**: `https://aquariangnosis.org/api/v1`

**Authentication**: Bearer JWT token in Authorization header

**Response Format**:
```json
{
  "data": { ... },
  "message": "Success",
  "status": 200
}
```

**Error Response Format**:
```json
{
  "detail": "Error message",
  "status": 400
}
```

### 7.5 State Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORE ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      authStore                           │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │ State:                                          │    │    │
│  │  │   - user: User | null                          │    │    │
│  │  │   - isAuthenticated: boolean                   │    │    │
│  │  │   - isLoading: boolean                         │    │    │
│  │  │   - error: string | null                       │    │    │
│  │  ├─────────────────────────────────────────────────┤    │    │
│  │  │ Actions:                                        │    │    │
│  │  │   - login(credentials)                         │    │    │
│  │  │   - register(userData)                         │    │    │
│  │  │   - logout()                                   │    │    │
│  │  │   - getCurrentUser()                           │    │    │
│  │  │   - clearError()                               │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   navigationStore                        │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │ State:                                          │    │    │
│  │  │   - currentPage: PageType                      │    │    │
│  │  │   - selectedUser: User | null                  │    │    │
│  │  │   - tabStates: { resources, organizations }    │    │    │
│  │  ├─────────────────────────────────────────────────┤    │    │
│  │  │ Actions:                                        │    │    │
│  │  │   - setCurrentPage(page)                       │    │    │
│  │  │   - navigateToMessages(user)                   │    │    │
│  │  │   - setResourcesTab(tab)                       │    │    │
│  │  │   - setOrganizationsTab(tab)                   │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     mapStore                             │    │
│  │  (Location management, nearby users, map state)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   messageStore                           │    │
│  │  (Conversations, messages, read status)                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. User Stories & Use Cases

### 8.1 Epic: User Discovery

#### US-001: Find Nearby Gnostics
**As** a gnostic practitioner in a new city,
**I want** to discover other practitioners nearby,
**So that** I can connect and potentially form a study group.

**Acceptance Criteria**:
- User can view map with public user locations
- User can filter by radius (5km, 10km, 25km, 50km)
- User can click marker to view basic user info
- User can initiate message from map view

#### US-002: Share My Location
**As** a gnostic practitioner,
**I want** to share my location on the map,
**So that** other seekers can find me.

**Acceptance Criteria**:
- User can add location via map click or geolocation
- User can set privacy level (public, local, auth-only)
- User can set status (permanent, traveling, nomadic)
- User can update or remove location anytime

### 8.2 Epic: Community Discussion

#### US-003: Create Forum Discussion
**As** a community member,
**I want** to start a discussion thread,
**So that** I can share insights or ask questions.

**Acceptance Criteria**:
- User must be authenticated
- User can select category
- User can add title and content
- Thread appears in category listing
- Other users can reply

#### US-004: Participate in Discussions
**As** a community member,
**I want** to reply to threads and vote on content,
**So that** I can contribute to community knowledge.

**Acceptance Criteria**:
- User can reply to threads
- User can reply to other replies (nested)
- User can upvote/downvote threads and replies
- User can edit own content
- User can delete own content

### 8.3 Epic: Study Groups

#### US-005: Create Study Group
**As** a gnostic instructor,
**I want** to create a study group,
**So that** I can organize regular study sessions.

**Acceptance Criteria**:
- User can create group with name/description
- User can set public or private
- User can set member limit
- User becomes admin automatically
- Group appears in listing

#### US-006: Join Study Group
**As** a gnostic student,
**I want** to join study groups,
**So that** I can learn with others.

**Acceptance Criteria**:
- User can browse public groups
- User can request to join
- User receives role of "member"
- User can view group members
- User can leave anytime

### 8.4 Epic: Resource Sharing

#### US-007: Share Resource
**As** a community member,
**I want** to share a gnostic resource,
**So that** others can benefit from it.

**Acceptance Criteria**:
- User can submit URL with title
- User can select resource type
- User can add description
- Resource enters approval queue
- Approved resources appear in listing

#### US-008: Discover Resources
**As** a gnostic student,
**I want** to browse curated resources,
**So that** I can deepen my studies.

**Acceptance Criteria**:
- User can browse by type (books, videos, etc.)
- User can see vote counts
- User can vote on resources
- Resources sorted by relevance/votes

### 8.5 Epic: Private Communication

#### US-009: Send Private Message
**As** a community member,
**I want** to send private messages,
**So that** I can connect one-on-one.

**Acceptance Criteria**:
- User can message any user
- Messages appear in conversation
- Recipient sees unread indicator
- Conversation history preserved

---

## 9. Non-Functional Requirements

### 9.1 Performance Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page Load Time | < 3 seconds | Time to interactive |
| API Response Time | < 200ms | 95th percentile |
| Database Query Time | < 50ms | Simple queries |
| Concurrent Users | 100+ | Simultaneous sessions |
| Bundle Size | < 500KB | Gzipped initial load |

### 9.2 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | JWT tokens with expiration |
| Password Storage | bcrypt hashing |
| Transport | HTTPS only |
| CORS | Configured allowed origins |
| Input Validation | Pydantic schemas |
| SQL Injection | Parameterized queries (SQLAlchemy) |
| XSS Prevention | React's built-in escaping |

### 9.3 Reliability Requirements

| Requirement | Target |
|-------------|--------|
| Uptime | 99.5% |
| Recovery Time | < 1 hour |
| Data Backup | Daily automated |
| Error Handling | Graceful degradation |

### 9.4 Accessibility Requirements

| Standard | Status |
|----------|--------|
| WCAG 2.1 AA | Partial (improvement needed) |
| Keyboard Navigation | Partial |
| Screen Reader Support | Partial |
| Color Contrast | Needs audit |

### 9.5 Scalability Requirements

| Metric | Year 1 | Year 2 |
|--------|--------|--------|
| Users | 2,500 | 10,000 |
| Monthly Requests | 100K | 500K |
| Database Size | 1GB | 10GB |
| Media Storage | 10GB | 100GB |

---

## 10. Development Roadmap

### 10.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT TIMELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Phase 1: Core Infrastructure         ████████████████ COMPLETE  │
│  - Authentication system                                          │
│  - Interactive map                                                │
│  - Basic messaging                                                │
│  - Landing page                                                   │
│                                                                   │
│  Phase 2: Community Foundation        ████████████████ COMPLETE  │
│  - Forum system                                                   │
│  - Study groups                                                   │
│  - Resource sharing                                               │
│  - Organizations directory                                        │
│                                                                   │
│  Phase 3: Advanced Features           ░░░░░░░░░░░░░░░░ PLANNED   │
│  - Events calendar                                                │
│  - Video integration                                              │
│  - Moderation tools                                               │
│  - Search system                                                  │
│  - PWA optimization                                               │
│                                                                   │
│  Phase 4: Scale & Growth              ░░░░░░░░░░░░░░░░ FUTURE    │
│  - Mobile applications                                            │
│  - Internationalization                                           │
│  - Analytics dashboard                                            │
│  - Advanced moderation                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Phase 3 Detailed Plan

| Feature | Priority | Dependencies | Notes |
|---------|----------|--------------|-------|
| Events Calendar | High | None | Core community feature |
| Search System | High | None | Cross-content search |
| Moderation Tools | High | Forums | Content management |
| PWA Optimization | Medium | None | Mobile experience |
| Video Integration | Medium | Resources | Embedded players |
| Real-time Messaging | Medium | WebSockets | Live updates |
| Email Notifications | Medium | None | Engagement |
| Password Reset | High | Email service | Security |

### 10.3 Phase 4 Vision

| Feature | Description |
|---------|-------------|
| Mobile Apps | Native iOS/Android applications |
| i18n | Spanish, Portuguese, French translations |
| Analytics | Community insights dashboard |
| Donations | Support platform sustainability |
| API | Public API for integrations |
| Federation | Connect with other gnostic platforms |

---

## 11. Risk Assessment

### 11.1 Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Low User Adoption** | Medium | High | SEO, community outreach, org partnerships |
| **Content Moderation Issues** | Medium | Medium | Clear guidelines, moderation tools, reporting |
| **Technical Scalability** | Low | High | Cloud infrastructure, caching, optimization |
| **Security Breach** | Low | Critical | Security audits, best practices, monitoring |
| **Organizational Politics** | Medium | Medium | Neutral positioning, focus on unity |
| **Resource Constraints** | Medium | Medium | Prioritization, MVP approach |
| **Database Issues** | Low | High | Backups, redundancy, monitoring |

### 11.2 Mitigation Strategies

#### Low User Adoption
- Partner with gnostic organizations for promotion
- SEO optimization for gnostic-related searches
- Social media presence
- Word-of-mouth from early adopters

#### Content Moderation
- Community guidelines clearly posted
- Voting system for self-moderation
- Report functionality
- Admin moderation tools (Phase 3)

#### Technical Scalability
- Redis caching implemented
- Database indexing
- CDN for static assets (future)
- Horizontal scaling capability

#### Security
- Regular dependency updates
- Security-focused code review
- HTTPS enforcement
- JWT token rotation

---

## Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Gnosis** | Greek for "knowledge"; refers to spiritual knowledge in esoteric traditions |
| **Samael Aun Weor** | Colombian author (1917-1977) who founded the modern gnostic movement |
| **The Three Factors** | Core practices: Death of ego, Birth of soul, Sacrifice for humanity |
| **Lumisial** | Local gnostic study center |
| **Transmutation** | Practice of transforming sexual energy for spiritual development |

### Appendix B: Referenced Documents

- `CLAUDE.md` - Development guidelines and technical debt
- `PROJECT_PLAN.md` - Detailed feature specifications
- `PHASE_2_COMPLETE.md` - Phase 2 completion report
- `deployment.md` - Production deployment guide
- `ecosystem.config.js` - PM2 configuration

### Appendix C: API Endpoint Reference

See full API documentation at: `https://aquariangnosis.org/api/v1/docs` (when enabled)

### Appendix D: Environment Configuration

**Development**:
```
VITE_API_BASE_URL=http://localhost:5040/api/v1
DATABASE_URL=postgresql://user:pass@localhost/aquarian_gnosis
REDIS_URL=redis://localhost:6379
SECRET_KEY=<development-key>
```

**Production**:
```
VITE_API_BASE_URL=https://aquariangnosis.org/api/v1
DATABASE_URL=<production-database-url>
REDIS_URL=<production-redis-url>
SECRET_KEY=<strong-random-key>
NODE_ENV=production
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-30 | Project Lead | Initial PRD creation |

---

*This document is the authoritative source for product requirements. All development decisions should align with specifications outlined herein.*
