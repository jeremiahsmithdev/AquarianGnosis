---
last_updated: 2026-01-08
status: current
tracks:
  - client/src/components/about/CommentSidebar.tsx
  - client/src/components/about/AboutContentBlock.tsx
  - client/src/stores/aboutStore.ts
  - server/app/api/about.py
  - server/app/models/about.py
---

# About Page Review System

[← Back to Index](./INDEX.md)

## Overview

- **Purpose**: Enable collaborative editing of the About page through comments and edit suggestions, similar to Google Docs review mode
- **Behavior**: Authenticated users can select text to add comments or suggest edits; admins can accept/reject suggestions and resolve comments
- **Key concepts**:
  - **Review Mode**: Toggle that enables text selection and shows the sidebar
  - **Comments**: Discussions about selected text, with threaded replies
  - **Suggestions**: Proposed text replacements that admins can accept (applying the change) or reject
  - **Highlights**: Inline visual indicators showing commented/suggested text ranges

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  About Page (Review Mode Active)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────┐   ┌────────────────────────┐  │
│  │                             │   │   Review Sidebar       │  │
│  │   Document Content          │   │                        │  │
│  │                             │   │   ● Comment 1          │  │
│  │   "Selected [highlighted    │   │     by user123         │  │
│  │   text] in the document"    │   │     "This needs..."    │  │
│  │                             │   │                        │  │
│  │   ┌─────────────────────┐   │   │   ● Suggestion 1       │  │
│  │   │ Comment │ Suggest   │   │   │     by user456         │  │
│  │   └─────────────────────┘   │   │     "text" → "content" │  │
│  │   (appears on selection)    │   │     [Accept] [Reject]  │  │
│  │                             │   │                        │  │
│  └─────────────────────────────┘   └────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### User Flow

1. User clicks "Review" toggle in page header
2. Review mode activates: sidebar appears, document shifts left
3. User selects text in the document
4. Action menu appears: "Comment" or "Suggest Edit"
5. Sidebar shows form to enter comment/suggestion
6. On submit, highlight appears on text, annotation shows in sidebar
7. Clicking highlight scrolls sidebar to that annotation (and vice versa)

### Admin Flow

- View all pending comments and suggestions
- **Resolve** comments (marks as handled, removes from view)
- **Accept** suggestions (applies text change to content)
- **Reject** suggestions (removes without applying)
- Delete any comment/suggestion

## Implementation

### Architecture

```
Frontend                              Backend
────────────────────────────────────────────────────────────
AboutPage.tsx
    │
    ├── ReviewModeToggle
    ├── AboutContentBlock ←──────────── GET /about/content
    │       │                              (blocks + annotations)
    │       ├── Text highlighting
    │       └── Selection handling
    │
    ├── SelectionActionMenu
    │
    └── CommentSidebar ←─────────────── POST /about/comments
            │                          POST /about/suggestions
            ├── New annotation form    DELETE /about/comments/:id
            ├── Annotation list        POST /about/comments/:id/resolve
            └── Action buttons         POST /about/suggestions/:id/accept
                                       POST /about/suggestions/:id/reject

aboutStore.ts ←──────────────────────── State management (Zustand)
```

### Key Components

| File | Purpose |
|------|---------|
| `client/src/pages/AboutPage.tsx` | Page container, review mode layout |
| `client/src/components/about/AboutContentBlock.tsx` | Renders content with inline highlights, handles text selection |
| `client/src/components/about/CommentSidebar.tsx` | Persistent sidebar showing all annotations |
| `client/src/components/about/SelectionActionMenu.tsx` | Floating menu on text selection |
| `client/src/components/about/ReviewModeToggle.tsx` | Header button to toggle review mode |
| `client/src/stores/aboutStore.ts` | Zustand store for state management |
| `client/src/styles/about.css` | All review system styles |
| `server/app/api/about.py` | REST API endpoints |
| `server/app/models/about.py` | SQLAlchemy database models |
| `server/app/schemas/about.py` | Pydantic request/response schemas |

### Text Offset Mapping

Comments and suggestions store **plain text offsets** (start/end positions in text without HTML tags). The `AboutContentBlock` component maps these to HTML positions for highlighting:

```typescript
// In AboutContentBlock.tsx - getHighlightedContent()
// Walks through HTML, tracking text position separately from HTML position
// Inserts <span class="comment-highlight"> at correct HTML positions
```

When accepting suggestions, the backend `apply_text_replacement()` function:
1. Strips HTML to get plain text
2. Verifies original text at offsets matches
3. Maps plain text offsets to HTML positions
4. Applies replacement preserving HTML structure

## API Endpoints

### Content

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/about/content` | Optional | Get all blocks with annotations |
| PUT | `/about/content/{block_id}` | Admin | Update block content |

### Comments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/about/comments` | User | List comments |
| POST | `/about/comments` | User | Create comment |
| DELETE | `/about/comments/{id}` | Owner/Admin | Delete comment |
| POST | `/about/comments/{id}/resolve` | Admin | Mark as resolved |
| POST | `/about/comments/{id}/reply` | User | Add reply |

### Suggestions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/about/suggestions` | User | List suggestions |
| POST | `/about/suggestions` | User | Create suggestion |
| DELETE | `/about/suggestions/{id}` | Owner | Delete own pending suggestion |
| POST | `/about/suggestions/{id}/accept` | Admin | Accept and apply change |
| POST | `/about/suggestions/{id}/reject` | Admin | Reject suggestion |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/about/admin/pending` | Admin | Get all pending items for review |

## Data Models

### AboutContentBlock
Stores page content as discrete blocks (header, section, paragraph, etc.)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| block_type | String | header, section, quote, paragraph, footer, list |
| block_key | String | Unique identifier (e.g., "intro", "mission") |
| display_order | Integer | Rendering order |
| content | Text | HTML content |
| is_active | Boolean | Whether to display |

### AboutComment
User comment anchored to a text selection.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| block_id | UUID | FK to content block |
| author_id | UUID | FK to user |
| start_offset | Integer | Plain text start position |
| end_offset | Integer | Plain text end position |
| selected_text | Text | The highlighted text |
| content | Text | Comment body |
| is_resolved | Boolean | Whether admin resolved it |

### AboutEditSuggestion
Proposed text replacement awaiting review.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| block_id | UUID | FK to content block |
| author_id | UUID | FK to user |
| start_offset | Integer | Plain text start position |
| end_offset | Integer | Plain text end position |
| original_text | Text | Text to replace |
| suggested_text | Text | Replacement text |
| status | String | pending, accepted, rejected |

### AboutContentHistory
Audit log of all content changes (created when suggestions are accepted).

## State Management

The `aboutStore` (Zustand) manages:

```typescript
interface AboutState {
  // Content
  blocks: AboutContentBlock[];      // All content with annotations
  canEdit: boolean;                 // Is current user admin?

  // Selection
  currentSelection: TextSelection | null;  // Active text selection

  // Sidebar
  isSidebarOpen: boolean;
  sidebarMode: 'view' | 'comment' | 'suggest';
  activeCommentId: string | null;   // Which annotation is focused

  // UI
  isReviewMode: boolean;            // Review mode toggle state
}
```

## Edge Cases & Limitations

- **Overlapping suggestions**: Only one pending suggestion allowed per text range (enforced by API)
- **HTML entities**: Offset mapping handles entities like `&amp;` as single characters
- **Content changes**: If block content changes after comments are made, offsets may become invalid
- **Line breaks**: Newlines in suggestions are converted to `<br>` tags when accepted

## Related Docs

- [Community Map](./community-map.md) - Another interactive feature with similar patterns
