# Aquarian Gnosis Website - Project Plan

## Project Overview

**Website Name:** Aquarian Gnosis  
**Domain:** aquariangnosis.org  
**Purpose:** A gnostic community platform dedicated to the gnosis of Samael Aun Weor, designed to connect gnostics worldwide from different organizations during the Aquarian era.

### Mission Statement
To create a unified digital space where gnostics from disparate organizations can connect, share resources, and form study groups regardless of their organizational affiliation or geographic location.

## Core Features

### 1. Landing Page Design
- **Background:** Banyan tree image (banyan.jpg from downloads)
- **Central Element:** Large gnostic cross (cross within a circle) positioned in front of the banyan tree
- **Navigation:** Four quadrants of the cross contain links to primary sections
- **Secondary Navigation:** Transparent navbar at top, seamlessly blending with background
- **Design Philosophy:** Beautiful, minimalistic, transparent elements

### 2. Primary Sections

#### Resources Section
- **Books:** Gnostic literature and works by Samael Aun Weor
- **Radio:** 
  - Independent providers (e.g., Koradi Radio)
  - Organization-affiliated radio stations
- **Videos:** Educational and spiritual content
- **Other Materials:** Documents, audio lectures, presentations

#### Organizations Section
- Directory of major gnostic organizations worldwide
- Direct links to organization websites
- Information about each organization's approach and location

#### Community Forum
- Discussion boards for gnostic topics
- Study group coordination
- Q&A sections
- Regional discussions

#### Map Section (Primary Feature)
- **Interactive World Map** showing:
  - Major gnostic organizations
  - Centers affiliated with different organizations
  - Unaffiliated temples and meditation places
  - Individual gnostics (self-registered)
- **Networking Features:**
  - User profiles and contact information
  - Study group formation tools
  - Local meetup coordination
  - Travel connection assistance

## Implementation Plan

### Phase 1: Foundation & Design
1. **Setup Development Environment**
   - Initialize project structure
   - Set up build tools and dependencies
   - Configure version control

2. **Design System Creation**
   - Define color palette (earth tones, transparency effects)
   - Typography selection (spiritual/mystical aesthetic)
   - Component library (buttons, cards, navigation)
   - Responsive breakpoints

3. **Landing Page Development**
   - Implement banyan tree background
   - Create gnostic cross SVG with interactive quadrants
   - Build transparent navigation system
   - Responsive layout optimization

### Phase 2: Core Sections
1. **Resources Section**
   - Content management system for books/media
   - Radio player integration
   - Video embedding capabilities
   - Search and categorization

2. **Organizations Directory**
   - Database schema for organization data
   - Admin interface for content management
   - Integration with map markers

3. **Community Forum**
   - User authentication system
   - Forum software integration or custom build
   - Moderation tools
   - Mobile-responsive design

### Phase 3: Interactive Map (Core Feature)
1. **Map Infrastructure**
   - Choose mapping service (Google Maps, Mapbox, OpenStreetMap)
   - Set up geolocation services
   - Database design for locations and users

2. **User Registration System**
   - Account creation and verification
   - Profile management
   - Privacy controls
   - Location sharing preferences

3. **Networking Features**
   - User discovery algorithms
   - Messaging/contact system
   - Study group formation tools
   - Event coordination features

### Phase 4: Enhancement & Optimization
1. **SEO & Performance**
   - Search engine optimization
   - Page load optimization
   - Mobile performance tuning

2. **Security & Privacy**
   - User data protection
   - Secure communication channels
   - Privacy controls for location sharing

3. **Analytics & Monitoring**
   - User engagement tracking
   - Map usage analytics
   - Community growth metrics

## Technical Considerations

### Technology Stack (Confirmed)
- **Frontend:** React with TypeScript, Zustand for state management
- **Backend:** FastAPI (Python) with strong API design
- **Database:** PostgreSQL for relational data, Redis for caching/sessions
- **Mapping:** Leaflet.js with OpenStreetMap tiles
- **Hosting:** Oracle Cloud VM (24GB RAM, 4OCPU ARM)
- **Architecture:** Modular, microservices-oriented for future scalability

### Key Requirements
- **Mobile-responsive design** across all devices
- **Cross-browser compatibility** for maximum reach
- **Accessibility compliance** for inclusive access
- **Modular architecture** with extensive file separation for future expansion
- **Future-proof codebase** designed for years of continuous development
- **Open-source dependencies** to avoid vendor lock-in
- **Multi-language support** (future consideration)
- **Offline capability** for core content (future consideration)
- **Strong API design** for potential future integrations

## Detailed System Requirements (Based on Clarifications)

### User Authentication & Privacy System
**Multi-tier Access Model:**
- **Anonymous Browsing:** Full map viewing without user locations
- **Registered Users:** Can see other users and add themselves to map
- **Authenticated Users:** Special verification process for enhanced trust
- **Study Group Members:** Private visibility within formed groups

**Privacy Controls:**
- **Public Visibility:** Visible to all registered users
- **Local Area Only:** Visible within specified distance radius
- **Authenticated Only:** Visible only to verified users
- **Study Group Only:** Visible only to group members
- **Anonymity Levels:** Configurable from full anonymous to partial disclosure
- **Platform-only Contact:** No external contact details shared initially
- **Progressive Trust:** Users can share more details as relationships develop

### Community-Driven Content System
**Tiered Membership Structure:**
- **Content Contribution Rights:** Based on user trustworthiness score
- **Moderation Abilities:** Higher tiers can moderate content and users
- **Verification Levels:** Content verification requirements by tier
- **Anonymous Contributions:** Anyone can add content, even without accounts

**Content Ranking System:**
- **Star/Upvote Mechanism:** Community-driven content visibility
- **Engagement Metrics:** User interaction affects trust ratings
- **Quality Control:** Higher-tier users can fast-track quality content
- **Reddit-style Moderation:** Community-driven moderation approach

### Modular Architecture Requirements
**Future-Proof Design Principles:**
- **Extensive File Separation:** Many small, focused modules
- **Large Skeleton Structure:** Prepared for years of expansion
- **Microservices Orientation:** Independent, scalable components
- **API-First Design:** Strong, documented API for all features
- **Plugin Architecture:** Easy addition of new features
- **Database Abstraction:** Easy migration and scaling

## Revised Implementation Phases

### Phase 0: Architecture Foundation (Critical)
1. **Project Structure Setup**
   - Monorepo configuration with clear separation
   - Frontend: `/client` with React + TypeScript + Zustand
   - Backend: `/server` with FastAPI + SQLAlchemy + Alembic
   - Shared: `/shared` for common types and utilities
   - Documentation: `/docs` for API specs and architecture

2. **Core Infrastructure**
   - Database schema design with migrations
   - Authentication/authorization framework
   - API structure with versioning
   - Error handling and logging systems
   - Testing frameworks and CI/CD pipeline

3. **Design System Foundation**
   - Component library structure
   - Theme system with transparency effects
   - Responsive breakpoint system
   - Accessibility framework

### Phase 1: Core Platform (MVP)
1. **Landing Page with Navigation**
   - Banyan tree background implementation
   - Gnostic cross SVG with interactive quadrants
   - Transparent navigation system
   - Mobile-responsive layout

2. **User System Foundation**
   - Registration/login system
   - Profile management
   - Privacy settings interface
   - Anonymous user handling

3. **Basic Map Implementation**
   - Leaflet.js integration with OpenStreetMap
   - User location markers
   - Privacy-aware location display
   - Basic search and filtering

### Phase 2: Community Features
1. **Forum System**
   - Reddit-style discussion threads
   - Community moderation tools
   - User reputation system
   - Study group coordination

2. **Content Management System**
   - Resource submission interface
   - Content categorization
   - Star/upvote system
   - Moderation queue

3. **Enhanced Map Features**
   - Study group formation tools
   - Local area filtering
   - User discovery algorithms
   - In-platform messaging

### Phase 3: Advanced Features
1. **Authentication System**
   - Verified user process
   - Trust score calculation
   - Tiered membership system
   - Progressive disclosure controls

2. **Organizations Integration**
   - Organization directory
   - Official representation system
   - Partnership integration (Glorian.org, koradi.org)
   - Resource aggregation

3. **Media Features**
   - Radio player integration
   - Video embedding
   - Document management
   - Content streaming

### Phase 4: Optimization & Growth
1. **Performance & Scalability**
   - Caching strategies
   - Database optimization
   - CDN implementation
   - Load balancing

2. **Advanced Community Features**
   - Event coordination system
   - Study group management
   - Mentorship matching
   - Local meetup tools

3. **Analytics & Insights**
   - Community growth metrics
   - User engagement analytics
   - Content performance tracking
   - Map usage patterns

## Detailed Feature Specifications (Based on Requirements Analysis)

### Authentication & Trust System
**Multi-Level Verification Process:**
- **Basic Level:** Email verification only
- **Community Verified:** Vouching system + study group membership
- **Time-Verified:** Platform activity over time with positive contributions
- **Future Consideration:** Knowledge-based gnosis questions

**Trust Score Algorithm Components:**
- Community upvotes/downvotes on content and interactions
- Content quality ratings from verified users
- Platform tenure and activity patterns (type and frequency)
- Successful study group formations and leadership
- Positive moderation actions and community contributions
- Geographic verification through consistent location patterns

### Study Group Management System
**Core Features:**
- **Private Discussion Areas:** Secure, encrypted group communications
- **Resource Sharing:** Document uploads, link sharing, media libraries
- **Meeting Scheduling:** Calendar integration with timezone handling
- **Optional Features:** Basic progress tracking, flexible reading assignments

### Content Organization Structure (Based on Glorian.org Analysis)
**Primary Categories:**
1. **Books & Texts**
   - By Samael Aun Weor work categories
   - Print, ebook, and online reading formats
   - Free access model following Glorian.org approach

2. **Multimedia Resources**
   - Videos (meditation, consciousness techniques, lectures)
   - Audio lectures and teachings
   - Radio stations (independent and organization-affiliated)

3. **Practice Materials**
   - Meditation guides and techniques
   - Practical exercises
   - Sacred sexuality teachings
   - Consciousness development practices

4. **Learning Paths** (Inspired by thegnosticmethod.beezer.com structure)
   - Beginner introduction courses
   - Progressive curriculum design
   - Practical spiritual development tracks
   - Multimedia learning resources

**Content Classification System:**
- **Difficulty Levels:** Beginner, Intermediate, Advanced
- **Practice Types:** Theory, Meditation, Exercises, Philosophy
- **Source Organizations:** Glorian, Koradi, Independent providers
- **Content Format:** Text, Video, Audio, Interactive

### Map & Location System
**Location Data Structure:**
- **Hierarchical Organization:** Country > Region > City > Specific Location
- **Dynamic Location Types:**
  - Permanent Address: Fixed organizational/personal locations
  - Current Location: Real-time or recent position updates
  - Status Indicators: At home, traveling, nomadic, temporarily relocated
- **Clustering:** Automatic grouping for dense urban areas
- **Historical Tracking:** Location change logs for trusted users

**Privacy & Visibility Controls:**
- **Public:** Visible to all registered users
- **Local Area:** Visible within specified distance radius
- **Authenticated Only:** Visible to community-verified users
- **Study Group Only:** Visible within formed study groups
- **Anonymity Levels:** Full anonymous to partial disclosure options

### Content Moderation Strategy
**Reddit-Style Community Moderation:**
- **Free-for-All Submission:** Anyone can add content (including anonymous users)
- **Pre-Approval System:** Content enters moderation queue before going live
- **Community Voting:** Star/upvote system determines content visibility
- **Tiered Moderation:** Higher trust users can expedite quality content
- **Automated Filtering:** Basic spam and inappropriate content detection

## Technical Architecture Specifications

### Database Schema Design

**User Management Tables:**
```sql
Users:
- id (UUID, primary key)
- username (unique, anonymity-friendly)
- email (encrypted, for verification)
- trust_score (calculated field)
- verification_level (basic, community, time-verified)
- created_at, updated_at
- profile_settings (JSON)

UserLocations:
- id (UUID, primary key)
- user_id (foreign key)
- location_type (permanent, current, temporary)
- latitude, longitude (encrypted)
- address_components (JSON - country, region, city)
- status (at_home, traveling, nomadic)
- visibility_level (public, local, authenticated, study_group)
- created_at, updated_at

TrustScores:
- id (UUID, primary key)
- user_id (foreign key)
- score_type (community_votes, content_quality, platform_activity, study_groups)
- score_value (numeric)
- calculated_at
```

**Content Management Tables:**
```sql
Content:
- id (UUID, primary key)
- title, description
- content_type (book, video, audio, article, link)
- difficulty_level (beginner, intermediate, advanced)
- practice_type (theory, meditation, exercises, philosophy)
- source_organization
- submitted_by (user_id, nullable for anonymous)
- moderation_status (pending, approved, rejected)
- upvotes, downvotes
- created_at, updated_at

ContentCategories:
- id (UUID, primary key)
- name, description
- parent_category_id (for hierarchical structure)
- samael_work_category
- display_order

StudyGroups:
- id (UUID, primary key)
- name, description
- creator_id (user_id)
- location_based (boolean)
- privacy_level (public, private, invite_only)
- max_members
- meeting_schedule (JSON)
- created_at, updated_at
```

**Geographic & Organization Tables:**
```sql
Organizations:
- id (UUID, primary key)
- name, description
- website_url
- organization_type (major, independent, local)
- contact_information (JSON)
- verified_status
- locations (array of location references)

Centers:
- id (UUID, primary key)
- name, description
- organization_id (nullable)
- location (geography point)
- center_type (temple, meditation_center, study_group_location)
- contact_info (JSON)
- verified_status
```

### API Architecture

**Core API Endpoints:**
```
/api/v1/auth/
  POST /register
  POST /login
  POST /verify-email
  GET /profile
  PUT /profile

/api/v1/map/
  GET /locations (with privacy filtering)
  POST /locations
  PUT /locations/{id}
  GET /organizations
  GET /centers
  GET /users-nearby

/api/v1/content/
  GET /content (with filtering)
  POST /content
  PUT /content/{id}/vote
  GET /categories
  GET /content/{id}

/api/v1/study-groups/
  GET /groups
  POST /groups
  POST /groups/{id}/join
  GET /groups/{id}/messages
  POST /groups/{id}/messages

/api/v1/community/
  GET /forum/threads
  POST /forum/threads
  POST /forum/threads/{id}/replies
  GET /moderation/queue
```

### Security & Privacy Framework

**Data Protection:**
- **Location Encryption:** AES-256 encryption for all geographic coordinates
- **Personal Information:** Encrypted email addresses, optional personal details
- **Communication Security:** End-to-end encryption for study group messages
- **Privacy by Design:** Default privacy-first settings for new users

**Access Control:**
- **Role-Based Permissions:** Anonymous, Registered, Verified, Moderator, Admin
- **Geographic Privacy:** Distance-based visibility with configurable radius
- **Content Access:** Trust-level based content visibility
- **API Security:** JWT tokens with refresh mechanism, rate limiting

## Integration with Existing Repository

### Current State Analysis
**Existing Assets:**
- **Basic Leaflet Setup:** Two HTML examples with geolocation
- **Package Configuration:** Leaflet.js dependency already installed
- **Map Examples:** User location detection and basic marker functionality

**Integration Strategy:**
- **Preserve Examples:** Keep existing HTML files as reference/prototypes
- **Build Upon Foundation:** Extend current Leaflet configuration
- **Leverage Existing Setup:** Use established OpenStreetMap tile configuration

### Development Environment Setup
**Current Dependencies:**
- Leaflet.js ^1.9.4 (already installed)

**Required Additions:**
```json
// Frontend Dependencies
"react": "^18.2.0",
"typescript": "^5.0.0",
"zustand": "^4.4.0",
"@types/leaflet": "^1.9.0",
"vite": "^4.4.0"

// Backend Dependencies (FastAPI)
"fastapi": "^0.104.0",
"sqlalchemy": "^2.0.0",
"alembic": "^1.12.0",
"pydantic": "^2.4.0",
"python-jose": "^3.3.0",
"bcrypt": "^4.0.0"
```

## Content Strategy (Based on Research)

### Initial Content Priorities
**Phase 1 - Foundation Content:**
1. **Core Samael Aun Weor Texts** (following Glorian.org free access model)
   - Essential beginner works
   - Progressive difficulty materials
   - Multiple format support (online, ebook, references to print)

2. **Learning Paths** (inspired by thegnosticmethod.beezer.com)
   - "Journey of the Self" introduction
   - Structured beginner curriculum
   - Practical spiritual development guides
   - Multimedia learning resources

3. **Organization Directory**
   - Major organizations (Glorian, Koradi, etc.)
   - Independent providers and centers
   - Website links and resource aggregation
   - Geographic location mapping

4. **Radio & Audio Resources**
   - Independent providers (Koradi Radio)
   - Organization-affiliated stations
   - Audio lectures and teachings
   - Streaming integration

### Content Management Workflow
**Community-Driven Approach:**
- **Open Submission:** Anyone can contribute content (anonymous or registered)
- **Moderation Queue:** All content requires approval before going live
- **Community Curation:** Upvote/star system for content visibility
- **Trust-Based Expediting:** Higher trust users can fast-track quality content
- **Collaborative Enhancement:** Community editing and improvement of resources

## Accessibility & International Considerations

### Multi-language Support Framework
**Based on Koradi.org Analysis:**
- **Priority Languages:** English, Spanish, French, Portuguese, Italian, German
- **Content Translation:** Community-driven translation system
- **Interface Localization:** React i18n implementation
- **Geographic Considerations:** Time zones, local customs, regional organizations

### Accessibility Compliance
- **WCAG 2.1 AA Standard** compliance for inclusive access
- **Screen Reader Compatibility** for visually impaired users
- **Keyboard Navigation** for users with motor disabilities
- **High Contrast Options** for users with visual impairments
- **Mobile Accessibility** for users primarily on mobile devices

## Success Metrics & Analytics

### Community Growth Indicators
- **User Registration:** Monthly active users, retention rates
- **Geographic Distribution:** Global spread of community members
- **Study Group Formation:** Number and success rate of groups formed
- **Content Engagement:** Upload rates, voting activity, resource usage
- **Map Utilization:** Location sharing adoption, connection success rates

### Technical Performance Metrics
- **Page Load Performance:** <2 second load times across all devices
- **Map Rendering Speed:** <1 second for location data loading
- **API Response Times:** <200ms for standard requests
- **Mobile Performance:** 90+ Lighthouse performance score
- **Accessibility Score:** 100% WCAG 2.1 AA compliance

### Content Quality Metrics
- **Moderation Efficiency:** <24 hour approval times for quality content
- **Community Satisfaction:** Rating system for resources and interactions
- **Educational Value:** Learning path completion rates
- **Resource Diversity:** Balance across content types and difficulty levels

## Risk Assessment & Mitigation

### Technical Risks
- **Scalability Challenges:** Modular architecture with microservices preparation
- **Privacy Vulnerabilities:** Encryption by default, regular security audits
- **Performance Issues:** Caching strategies, CDN implementation
- **Data Loss:** Automated backups, disaster recovery procedures

### Community Risks
- **Content Quality Control:** Multi-tier moderation system
- **User Safety:** Privacy controls, anonymous reporting systems
- **Platform Misuse:** Clear community guidelines, enforcement procedures
- **Organizational Conflicts:** Neutral stance, focus on unity

### Legal & Compliance Risks
- **Data Protection:** GDPR compliance, user consent management
- **Content Rights:** Fair use guidelines, attribution requirements
- **Location Privacy:** Opt-in geographic sharing, data minimization
- **International Regulations:** Jurisdiction-aware privacy controls

---

## Summary: Technical Specification Readiness

This comprehensive project plan now serves as a complete technical specification for the Aquarian Gnosis platform, incorporating:

✅ **Detailed Feature Requirements** based on user clarifications
✅ **Technical Architecture** with database schemas and API specifications
✅ **Research-Based Content Strategy** informed by successful gnostic platforms
✅ **Modular Development Approach** designed for long-term expansion
✅ **Privacy & Security Framework** appropriate for community networking
✅ **Integration Strategy** building on existing repository assets
✅ **Success Metrics** for measuring platform effectiveness
✅ **Risk Mitigation** strategies for sustainable growth

**Ready for Phase-by-Phase Implementation Planning**

*This specification provides the foundation for creating a detailed implementation roadmap with specific development milestones, timeline estimates, and resource requirements.*
