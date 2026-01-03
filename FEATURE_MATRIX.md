# Aquarian Gnosis Feature Matrix

*Based on "The Philosophy of Aquarian Gnosis" and community research*

---

## Executive Summary

This feature matrix maps platform capabilities against the core mission outlined in the Philosophy document: **connecting gnostic seekers worldwide, bridging organizational fragmentation, and providing universal access to spiritual knowledge**.

Research into gnostic community forums, discussions, and existing platforms reveals consistent pain points:
- **Isolation**: Practitioners struggling to find others nearby
- **Fragmentation**: Multiple organizations with no unified discovery platform
- **Resource Accessibility**: Difficulty finding quality materials, especially in English
- **Study Support**: Lack of structured guidance for independent practitioners
- **Trust & Safety**: Concerns about connecting with unknown practitioners

---

## Feature Matrix Overview

### Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully implemented and functional |
| 🔶 | Partially implemented (basic foundation exists) |
| ⬜ | Not started |
| 🔴 | Critical priority |
| 🟠 | High priority |
| 🟡 | Medium priority |
| ⚪ | Low priority |

---

## 1. Interactive Global Map (Core Feature) 🔴

*Philosophy: "An interactive map enabling practitioners to discover fellow seekers in their area, find gnostic centers and organizations, and connect with traveling instructors and study groups—all with robust privacy controls."*

**Parent Status: 🔶 Partial (Foundation Only)**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **1.1 Map Foundation** | | | |
| ├─ Leaflet map rendering | ✅ | 🔴 | OpenStreetMap tiles working |
| ├─ Responsive map container | ✅ | 🔴 | Works on mobile/desktop |
| └─ Map zoom/pan controls | ✅ | 🔴 | Standard Leaflet controls |
| **1.2 User Location Markers** | | | |
| ├─ Display user's own location | ✅ | 🔴 | Blue marker with status |
| ├─ Display other users' locations | ✅ | 🔴 | Shows username in popup |
| ├─ "Find My Location" geolocation | ✅ | 🔴 | Red pin for current GPS |
| ├─ Map click location selection | ✅ | 🟠 | Green marker, crosshair cursor |
| ├─ Location search (Radar API) | ✅ | 🟠 | City/address autocomplete |
| ├─ User popup with basic info | ✅ | 🟠 | Shows @username and status |
| ├─ "Contact User" from popup | 🔶 | 🟠 | Button exists, messaging unclear |
| └─ User avatar/profile preview | ⬜ | 🟡 | |
| **1.3 Organization Markers** | | | |
| ├─ Display organization locations | ⬜ | 🔴 | **Not implemented** |
| ├─ Organization popup with details | ⬜ | 🔴 | |
| ├─ Link to organization website | ⬜ | 🟠 | |
| ├─ Organization verification badge | ⬜ | 🟡 | |
| └─ Distinguish org types (major/local/independent) | ⬜ | 🟡 | |
| **1.4 Study Group Markers** | | | |
| ├─ Display study group locations | ⬜ | 🔴 | **Not implemented** |
| ├─ Study group popup with info | ⬜ | 🟠 | |
| ├─ Join group from map | ⬜ | 🟠 | |
| └─ Show meeting times/schedule | ⬜ | 🟡 | |
| **1.5 Filtering & Search** | | | |
| ├─ Filter by marker type (users/orgs/groups) | 🔶 | 🔴 | UI exists, orgs/groups pending |
| ├─ Distance radius filter/slider | ✅ | 🔴 | 10-500km slider working |
| ├─ Status filter (permanent/traveling/nomadic) | ✅ | 🟠 | Dropdown filter working |
| ├─ Search by location name/city | ✅ | 🟠 | Radar API autocomplete |
| ├─ Filter by organization affiliation | ⬜ | 🟡 | |
| └─ Filter by user interests/practices | ⬜ | 🟡 | |
| **1.6 Privacy Controls** | | | |
| ├─ **Location Visibility Levels** | ✅ | 🔴 | Three-tier system implemented |
| │   ├─ Public | ✅ | 🟠 | Visible to all (including guests) |
| │   ├─ Members only | ✅ | 🟠 | Signed-in users only |
| │   ├─ Custom (selected users only) | ✅ | 🟠 | Whitelist specific usernames |
| │   ├─ Friends only | ⬜ | 🟡 | Requires Friends feature (see 6.5) |
| │   └─ By group/org/study group | ⬜ | 🟡 | Share with specific communities |
| ├─ Privacy disclaimer | ✅ | 🟠 | Shown when adding location |
| ├─ Location precision control | ⬜ | 🟡 | City-level vs exact coordinates |
| ├─ Visibility preview | ⬜ | 🟡 | See who can view your location |
| └─ Anonymous browsing mode | ⬜ | 🟡 | Browse map without being seen |
| **1.7 Advanced Features** | | | |
| ├─ Marker clustering for dense areas | ⬜ | 🟠 | |
| ├─ Traveling practitioner status | ⬜ | 🟡 | |
| ├─ Event markers | ⬜ | 🟡 | |
| └─ Heat map visualization | ⬜ | ⚪ | |

**Completion: ~55%** (user markers, filtering, privacy controls working; org/group markers pending)

---

## 2. Resources System 🔴

*Philosophy: "A curated collection of gnostic resources—books, audio lectures, videos, blogs, and sacred art—submitted and rated by the community, making quality materials discoverable and accessible."*

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **2.1 Resource Categories** | | | |
| ├─ Category tabs (books, video, audio, art, blogs) | ✅ | 🔴 | Working |
| ├─ Static/seed content per category | ✅ | 🟡 | Basic examples |
| └─ Category descriptions | ⬜ | ⚪ | |
| **2.2 Community Submissions** | | | |
| ├─ Submit resource link | ✅ | 🔴 | Form exists |
| ├─ Resource title/description | ✅ | 🔴 | Working |
| ├─ Upvote/downvote resources | ✅ | 🟠 | Basic voting |
| └─ Resource type selection | ✅ | 🟠 | Tied to active tab |
| **2.3 File Upload & Download** | | | |
| ├─ **Upload resource files (PDF, ePub, MP3)** | ⬜ | 🔴 | **Critical - not started** |
| ├─ **Download resource files** | ⬜ | 🔴 | **Critical - not started** |
| ├─ **Download count tracking** | ⬜ | 🔴 | **Critical - not started** |
| ├─ File type validation | ⬜ | 🟠 | |
| ├─ File size limits | ⬜ | 🟠 | |
| └─ CDN/storage integration | ⬜ | 🟠 | |
| **2.4 Rating System** | | | |
| ├─ **1-5 star rating** | ⬜ | 🔴 | **Critical - not started** |
| ├─ **Average rating display** | ⬜ | 🔴 | **Critical - not started** |
| ├─ Rating count | ⬜ | 🟠 | |
| └─ Rating breakdown/distribution | ⬜ | ⚪ | |
| **2.5 Discovery & Organization** | | | |
| ├─ Search within resources | ⬜ | 🔴 | |
| ├─ Filter by type/category | 🔶 | 🟠 | Tabs only |
| ├─ Sort by rating/downloads/date | ⬜ | 🟠 | |
| ├─ Difficulty level tags | ⬜ | 🟡 | |
| └─ Topic/practice tags | ⬜ | 🟡 | |
| **2.6 Moderation** | | | |
| ├─ Approval queue for submissions | ⬜ | 🟠 | |
| ├─ Report inappropriate content | ⬜ | 🟠 | |
| └─ Trusted user fast-track | ⬜ | 🟡 | |
| **2.7 User Features** | | | |
| ├─ Personal bookmarks/library | ⬜ | 🟡 | |
| ├─ Reading/listening progress | ⬜ | ⚪ | |
| └─ Resource recommendations | ⬜ | ⚪ | |
| **2.8 Media Players** | | | |
| ├─ Embedded audio player | ⬜ | 🟡 | |
| ├─ Video embedding | 🔶 | 🟡 | Basic YouTube possible |
| └─ Radio station integration | ⬜ | 🟡 | Koradi Radio etc. |

**Completion: ~30%** (categories and basic submission, no file handling or ratings)

---

## 3. Study Groups 🔴

*Philosophy: "Tools for forming and managing study groups, whether local or virtual, enabling practitioners to coordinate regular study sessions and progress together through the teachings."*

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **3.1 Group Management** | | | |
| ├─ Create study group | ✅ | 🔴 | Form exists |
| ├─ Join study group | ✅ | 🔴 | Button exists |
| ├─ Leave study group | ⬜ | 🟠 | |
| ├─ Group name/description | ✅ | 🔴 | Working |
| ├─ Public/private setting | ✅ | 🟠 | Working |
| └─ Max members limit | ✅ | 🟡 | Field exists |
| **3.2 Communication** | | | |
| ├─ **Group messaging/chat** | ⬜ | 🔴 | **Critical - not started** |
| ├─ Message history | ⬜ | 🔴 | |
| ├─ Member mentions/notifications | ⬜ | 🟠 | |
| └─ File/resource sharing in chat | ⬜ | 🟡 | |
| **3.3 Scheduling** | | | |
| ├─ **Meeting scheduling** | ⬜ | 🔴 | **Critical - not started** |
| ├─ Recurring meetings | ⬜ | 🟠 | |
| ├─ Timezone handling | ⬜ | 🟠 | |
| ├─ Calendar view | ⬜ | 🟡 | |
| └─ Video call link integration | ⬜ | 🟡 | |
| **3.4 Study Materials** | | | |
| ├─ Group resource library | ⬜ | 🟠 | |
| ├─ Reading assignments | ⬜ | 🟡 | |
| ├─ Study curriculum/syllabus | ⬜ | 🟡 | |
| └─ Progress tracking | ⬜ | 🟡 | |
| **3.5 Member Management** | | | |
| ├─ Member list display | 🔶 | 🟠 | Basic count only |
| ├─ Member roles (admin/mod/member) | 🔶 | 🟠 | Field exists |
| ├─ Invite members | ⬜ | 🟠 | |
| ├─ Remove members (admin) | ⬜ | 🟡 | |
| └─ Member activity status | ⬜ | ⚪ | |
| **3.6 Discovery** | | | |
| ├─ Browse available groups | ✅ | 🟠 | List exists |
| ├─ Search groups | ⬜ | 🟠 | |
| ├─ Filter by location | ⬜ | 🟠 | |
| ├─ Filter by topic/focus | ⬜ | 🟡 | |
| └─ Recommended groups | ⬜ | ⚪ | |

**Completion: ~25%** (create/join works, no communication or scheduling)

---

## 4. Community Forum 🟠

*Philosophy: "Discussion spaces organized by topic—The Three Factors, Dream Yoga, Alchemy, Meditation, and more—where students can share insights, ask questions, and support one another in their inner work."*

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **4.1 Core Forum** | | | |
| ├─ Forum categories | ✅ | 🔴 | Working |
| ├─ Create threads | ✅ | 🔴 | Working |
| ├─ Reply to threads | ✅ | 🔴 | Working |
| ├─ Upvote/downvote | ✅ | 🟠 | Working |
| └─ Thread listing | ✅ | 🔴 | Working |
| **4.2 Gnostic Topic Categories** | | | |
| ├─ Three Factors category | ⬜ | 🟠 | Need preset categories |
| ├─ Dream Yoga category | ⬜ | 🟠 | |
| ├─ Meditation category | ⬜ | 🟠 | |
| ├─ Alchemy category | ⬜ | 🟠 | |
| └─ General/Q&A category | ⬜ | 🟠 | |
| **4.3 Thread Features** | | | |
| ├─ Thread pinning | ⬜ | 🟡 | |
| ├─ Thread locking | ⬜ | 🟡 | |
| ├─ Edit posts | ⬜ | 🟠 | |
| ├─ Delete posts | ⬜ | 🟠 | |
| └─ Rich text/markdown | ⬜ | 🟡 | |
| **4.4 Discovery** | | | |
| ├─ Search threads | ⬜ | 🟠 | |
| ├─ Sort by date/activity/votes | ⬜ | 🟡 | |
| └─ Filter by category | 🔶 | 🟡 | Category selection exists |
| **4.5 Engagement** | | | |
| ├─ Thread subscription | ⬜ | 🟡 | |
| ├─ User mentions | ⬜ | 🟡 | |
| └─ Notifications | ⬜ | 🟠 | |
| **4.6 Moderation** | | | |
| ├─ Report posts | ⬜ | 🟠 | |
| ├─ Moderator tools | ⬜ | 🟠 | |
| └─ Auto-moderation | ⬜ | ⚪ | |

**Completion: ~40%** (basic CRUD works, needs polish and gnostic categories)

---

## 5. Organizations Directory 🟠

*Philosophy: "A comprehensive directory of gnostic organizations worldwide, helping seekers find instruction and community in their own traditions."*

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **5.1 Organization Listings** | | | |
| ├─ Major organizations list | ✅ | 🔴 | Static content |
| ├─ Local centers list | 🔶 | 🟠 | Placeholder data |
| ├─ Independent groups list | 🔶 | 🟡 | Placeholder data |
| ├─ Organization descriptions | ✅ | 🟠 | Working |
| └─ Website links | ✅ | 🟠 | Working |
| **5.2 Map Integration** | | | |
| ├─ Organizations on map | ⬜ | 🔴 | **Not implemented** |
| ├─ Centers on map | ⬜ | 🔴 | |
| └─ Click marker → org details | ⬜ | 🟠 | |
| **5.3 Community Submissions** | | | |
| ├─ Submit new organization | ⬜ | 🟠 | |
| ├─ Submit local center | ⬜ | 🟠 | |
| ├─ Verification process | ⬜ | 🟡 | |
| └─ Edit/update submissions | ⬜ | 🟡 | |
| **5.4 Organization Details** | | | |
| ├─ Contact information | ⬜ | 🟡 | |
| ├─ Class schedules | ⬜ | 🟡 | |
| ├─ Associated resources | ⬜ | 🟡 | |
| └─ User reviews/ratings | ⬜ | ⚪ | |

**Completion: ~35%** (static listings only, no map integration or submissions)

---

## 6. User System 🟠

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **6.1 Authentication** | | | |
| ├─ Registration | ✅ | 🔴 | Working |
| ├─ Login/logout | ✅ | 🔴 | Working |
| ├─ JWT token auth | ✅ | 🔴 | Working |
| ├─ Password reset | ⬜ | 🟠 | |
| └─ Email verification | ⬜ | 🟠 | |
| **6.2 Profile** | | | |
| ├─ Basic profile (username) | ✅ | 🔴 | Working |
| ├─ User bio | ⬜ | 🟠 | |
| ├─ Spiritual interests/practices | ⬜ | 🔴 | **Key for matching** |
| ├─ Organizational affiliation | ⬜ | 🔴 | **Key for unity mission** |
| ├─ Experience level | ⬜ | 🟡 | |
| ├─ Profile photo/avatar | ⬜ | 🟡 | |
| └─ Social links | ⬜ | ⚪ | |
| **6.3 Privacy** | | | |
| ├─ Location visibility toggle | 🔶 | 🔴 | Basic implementation |
| ├─ Profile visibility levels | ⬜ | 🟠 | |
| ├─ Block users | ⬜ | 🟠 | |
| └─ Data export | ⬜ | ⚪ | |
| **6.4 Trust System** | | | |
| ├─ Reputation score | ⬜ | 🟡 | |
| ├─ Community vouching | ⬜ | 🟡 | |
| ├─ Activity-based trust | ⬜ | 🟡 | |
| └─ Verification badges | ⬜ | ⚪ | Future: verified user status |
| **6.5 Friends System** | | | |
| ├─ Send friend request | ⬜ | 🟠 | Required for friends-only privacy |
| ├─ Accept/decline friend request | ⬜ | 🟠 | |
| ├─ Friends list view | ⬜ | 🟠 | |
| ├─ Remove friend | ⬜ | 🟡 | |
| ├─ Friend request notifications | ⬜ | 🟡 | |
| └─ Block user from sending requests | ⬜ | 🟡 | |

**Completion: ~35%** (auth works, profiles need expansion)

---

## 7. Messaging System 🟠

**Parent Status: 🔶 Partial**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **7.1 Direct Messaging** | | | |
| ├─ Send messages | ✅ | 🔴 | Working |
| ├─ Inbox view | ✅ | 🔴 | Working |
| ├─ Conversation threading | ✅ | 🟠 | Working |
| └─ Message from map popup | 🔶 | 🟠 | Button exists |
| **7.2 Notifications** | | | |
| ├─ Unread message indicator | ⬜ | 🟠 | |
| ├─ Email notifications | ⬜ | 🟠 | |
| └─ Push notifications | ⬜ | 🟡 | |
| **7.3 Safety** | | | |
| ├─ Block users | ⬜ | 🟠 | |
| ├─ Report messages | ⬜ | 🟠 | |
| └─ Spam filtering | ⬜ | 🟡 | |
| **7.4 Group Messaging** | | | |
| ├─ Study group chat | ⬜ | 🔴 | **Not implemented** |
| └─ Group notifications | ⬜ | 🟡 | |

**Completion: ~40%** (direct messaging works, no group chat or notifications)

---

## 8. Platform Infrastructure 🟡

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **8.1 Mobile Experience** | | | |
| ├─ Responsive design | ✅ | 🔴 | Working |
| ├─ PWA installation | ✅ | 🟡 | Working |
| ├─ Touch optimizations | 🔶 | 🟡 | Basic |
| └─ Offline support | ⬜ | ⚪ | |
| **8.2 Accessibility** | | | |
| ├─ WCAG 2.1 AA compliance | 🔶 | 🟠 | Partial |
| ├─ Screen reader support | ⬜ | 🟠 | |
| ├─ Keyboard navigation | ⬜ | 🟡 | |
| └─ High contrast mode | ⬜ | ⚪ | |
| **8.3 Internationalization** | | | |
| ├─ Multi-language support | ⬜ | 🟠 | Spanish, Portuguese key |
| ├─ RTL language support | ⬜ | ⚪ | |
| └─ Timezone handling | ⬜ | 🟡 | |
| **8.4 Administration** | | | |
| ├─ Admin dashboard | ⬜ | 🟠 | |
| ├─ Content moderation queue | ⬜ | 🟠 | |
| ├─ User management | ⬜ | 🟡 | |
| └─ Analytics/metrics | ⬜ | 🟡 | |

**Completion: ~30%**

---

## 9. Learning Paths (Future) 🟡

*Philosophy: "Revolution of Consciousness...the psychological and spiritual work of awakening consciousness"*

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| ├─ Structured beginner curriculum | ⬜ | 🟠 | |
| ├─ Three Factors learning path | ⬜ | 🟠 | |
| ├─ Meditation technique guides | ⬜ | 🟠 | |
| ├─ Progress tracking | ⬜ | 🟡 | |
| ├─ Practice integration | ⬜ | 🟡 | |
| └─ Completion recognition | ⬜ | ⚪ | |

**Completion: 0%**

---

## 10. Events System (Future) 🟡

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| ├─ Create events | ⬜ | 🟠 | |
| ├─ Event discovery by location | ⬜ | 🟠 | |
| ├─ Event RSVP | ⬜ | 🟡 | |
| ├─ Virtual event support | ⬜ | 🟡 | |
| ├─ Calendar view | ⬜ | 🟡 | |
| └─ Retreat announcements | ⬜ | ⚪ | |

**Completion: 0%**

---

## 11. Telegram Integration 🟠

*Community insight: Many gnostic practitioners use Telegram for communication. Enabling Telegram login reduces friction for new users and leverages existing community networks.*

**Parent Status: ⬜ Not Started**

| Sub-Feature | Status | Priority | Notes |
|-------------|--------|----------|-------|
| **11.1 Telegram Authentication** | | | |
| ├─ Create account via Telegram | ⬜ | 🟠 | Login Widget integration |
| ├─ Link existing account to Telegram | ⬜ | 🟠 | Settings page option |
| ├─ Unlink Telegram from account | ⬜ | 🟡 | |
| └─ Login with linked Telegram | ⬜ | 🟠 | |
| **11.2 Profile Import** | | | |
| ├─ Import Telegram username | ⬜ | 🟠 | Default, user-changeable |
| ├─ Import Telegram avatar | ⬜ | 🟠 | Default, user-changeable |
| ├─ Import first/last name | ⬜ | 🟡 | Default, user-changeable |
| └─ Override with custom profile data | ⬜ | 🟡 | Per-field control |
| **11.3 Infrastructure** | | | |
| ├─ Telegram Bot setup (BotFather) | ⬜ | 🔴 | Required for widget |
| ├─ Domain verification (/setdomain) | ⬜ | 🔴 | aquariangnosis.org |
| ├─ HMAC-SHA-256 hash validation | ⬜ | 🔴 | Security requirement |
| └─ Store Telegram ID in users table | ⬜ | 🔴 | Database schema change |

**Completion: 0%**

**Technical Notes:**
- Telegram Login Widget does NOT provide user bio (only id, username, first_name, last_name, photo_url)
- Widget won't work on localhost - requires production domain for testing
- React package available: `react-telegram-login`
- FastAPI template available: `fastapi-telegram`

---

## Summary by Completion

| Feature Area | Completion | Critical Gaps |
|--------------|------------|---------------|
| Interactive Map | ~55% | User markers working, filters/search done, org/group markers pending |
| Resources | ~30% | No file upload/download, no ratings, no search |
| Study Groups | ~25% | No group messaging, no scheduling |
| Forum | ~40% | Needs gnostic topic categories, search, moderation |
| Organizations | ~35% | Not on map, no community submissions |
| User System | ~35% | Missing spiritual interests, org affiliation fields |
| Messaging | ~40% | No group chat, no notifications |
| Infrastructure | ~30% | No admin tools, no multi-language |
| Learning Paths | 0% | Not started |
| Events | 0% | Not started |
| Telegram Integration | 0% | Not started - requires bot setup and domain verification |

---

## Immediate Priorities (Next Sprint)

Based on Philosophy alignment and community pain points:

### 🔴 Critical (Must Have)

1. **Resource File Upload & Download** - Core mission of accessible resources
2. **Resource Rating System** - Quality curation
3. **Study Group Messaging** - Enable group coordination
4. **Organization Markers on Map** - Find gnostic centers
5. ~~**Distance-based User Filtering**~~ ✅ - Radius slider implemented
6. **User Spiritual Interests Field** - Enable meaningful connections

### 🟠 High Priority (Should Have)

1. ~~Map marker type filtering~~ ✅ - UI exists (orgs/groups coming soon)
2. Study group scheduling
3. Resource search
4. Gnostic topic forum categories
5. User organizational affiliation field
6. Email notifications

---

## Database Schema Additions Required

```sql
-- Resource enhancements
ALTER TABLE shared_resources ADD COLUMN
    file_path VARCHAR(500),
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    download_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0;

CREATE TABLE resource_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES shared_resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(resource_id, user_id)
);

CREATE TABLE resource_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES shared_resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    downloaded_at TIMESTAMP DEFAULT NOW()
);

-- User profile enhancements
ALTER TABLE users ADD COLUMN
    bio TEXT,
    spiritual_interests TEXT[], -- Array: ['meditation', 'dream_yoga', 'alchemy', etc.]
    organization_affiliation VARCHAR(255),
    experience_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    avatar_url VARCHAR(500);

-- Location visibility settings
-- visibility_level: 'none' | 'custom' | 'friends' | 'groups' | 'registered' | 'public'
ALTER TABLE users ADD COLUMN
    location_visibility VARCHAR(20) DEFAULT 'registered',
    location_precision VARCHAR(20) DEFAULT 'exact'; -- 'exact' | 'city' | 'region'

-- Custom visibility whitelist (for 'custom' visibility level)
CREATE TABLE location_visibility_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    allowed_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(owner_user_id, allowed_user_id)
);

-- Group-based visibility (for 'groups' visibility level)
CREATE TABLE location_visibility_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_type VARCHAR(50) NOT NULL, -- 'study_group' | 'organization'
    group_id UUID NOT NULL, -- References study_groups or organizations
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, group_type, group_id)
);

-- Friends system
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined' | 'blocked'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id != addressee_id)
);

-- Study group messaging
CREATE TABLE study_group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Organization locations for map
ALTER TABLE organizations ADD COLUMN
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_verified BOOLEAN DEFAULT FALSE;
```

---

## Metrics for Success

| Goal | Metric | Target |
|------|--------|--------|
| "Connect gnostics worldwide" | Registered users | 1,000 in Year 1 |
| "Bridge organizational fragmentation" | Users from different orgs interacting | 30% cross-org connections |
| "Find fellow seekers" | Successful connections made | 50% of active users |
| "Form study groups" | Active study groups | 100 groups in Year 1 |
| "Share resources" | Resources uploaded | 500 resources in Year 1 |
| "Resource accessibility" | Average downloads per resource | 50+ downloads |
| "Community-driven" | User engagement rate | 40% monthly active |

---

*Document updated: 2026-01-02*
*Latest: Interactive Map Phase 1 complete - user markers with username popups, radius/status filters, Radar location search, three-tier visibility (public/members/custom), GPS + map click + search location input*
*Previous: Updated location privacy system (Section 1.6) with tiered visibility levels, added Friends System (Section 6.5)*
*Based on: Philosophy document, PROJECT_PLAN.md, codebase analysis, community research*
