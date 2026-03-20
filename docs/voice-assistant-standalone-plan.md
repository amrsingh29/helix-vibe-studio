# Helix Voice Assistant — Standalone Implementation Plan

> **Version**: 1.0 | **Date**: 2026-03-14  
> **Stack**: Next.js (Frontend) + Python FastAPI (Backend) + BMC Helix AI Agent (ITSM Intelligence)  
> **Goal**: A standalone, modern web application that provides voice-enabled ITSM assistance by connecting to existing BMC Helix AI Agents via API.  
> **Admin UI**: Built-in administration panel for managing all integrations, API keys, agents, and user settings.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Application Structure](#4-application-structure)
5. [Screen-by-Screen UI Specification](#5-screen-by-screen-ui-specification)
6. [Admin Panel Design](#6-admin-panel-design)
7. [Voice Pipeline Design](#7-voice-pipeline-design)
8. [BMC Helix AI Agent Integration](#8-bmc-helix-ai-agent-integration)
9. [Data Model](#9-data-model)
10. [API Design](#10-api-design)
11. [Authentication & Security](#11-authentication--security)
12. [Phased Implementation Plan](#12-phased-implementation-plan)
13. [Deployment Architecture](#13-deployment-architecture)
14. [Testing Strategy](#14-testing-strategy)
15. [Demo Scenarios](#15-demo-scenarios)
16. [Future Enhancements](#16-future-enhancements)

---

## 1. Product Vision

### What This Is

A **standalone web application** — separate from the BMC Helix UI — that gives ITSM users a modern, voice-first conversational interface to interact with BMC Helix. It connects to existing Helix AI Agents via API, meaning all ITSM intelligence (incident queries, ticket creation, knowledge search, tool execution) is handled by the agents. This application is the **voice and visual layer**.

### Why Standalone (Not Inside Innovation Studio)

| Reason | Benefit |
|---|---|
| Full control over UI/UX | Next.js + Tailwind gives pixel-perfect control matching the reference design |
| No platform constraints | WebSockets, streaming, modern React patterns — no OSGi, no Angular limitations |
| Faster development cycle | Hot reload, modern tooling, no Docker build cycle |
| Shareable with non-Helix users | Executives, managers can access without a Helix license |
| Independent scaling | Voice processing scales independently from Helix platform |
| Admin panel freedom | Full CRUD admin UI without Innovation Studio designer constraints |

### Core User Personas

| Persona | How They Use It |
|---|---|
| **Helpdesk Agent** | Hands-free ticket creation during phone calls, voice-based incident lookup |
| **IT Manager** | Voice-driven operations summary, quick status checks between meetings |
| **End User** | Self-service ITSM via natural conversation instead of portal forms |
| **Administrator** | Admin panel to configure agents, API keys, voice settings, user access |

---

## 2. System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    NEXT.JS FRONTEND                                │  │
│  │                                                                    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │  │
│  │  │ Voice UI    │  │ Dashboard    │  │ Admin Panel              │ │  │
│  │  │ (Session)   │  │ (History)    │  │ (Configuration)          │ │  │
│  │  └──────┬──────┘  └──────┬───────┘  └──────────┬───────────────┘ │  │
│  │         │                │                      │                 │  │
│  │  ┌──────▼────────────────▼──────────────────────▼──────────────┐ │  │
│  │  │  Client-Side Services                                       │ │  │
│  │  │  • Web Speech API (STT)    • Audio Capture (MediaRecorder)  │ │  │
│  │  │  • SpeechSynthesis (TTS)   • WebSocket Client               │ │  │
│  │  └────────────────────────────┬────────────────────────────────┘ │  │
│  └───────────────────────────────┼────────────────────────────────────┘  │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │  HTTP / WebSocket
                                   │
┌──────────────────────────────────▼──────────────────────────────────────┐
│                       PYTHON BACKEND (FastAPI)                          │
│                                                                         │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Voice Router   │  │ Session Manager │  │ Admin Router             │  │
│  │ • /ws/voice    │  │ • Create/Resume │  │ • /api/admin/agents      │  │
│  │ • /api/tts     │  │ • History store │  │ • /api/admin/settings    │  │
│  │ • /api/stt     │  │ • Context mgmt  │  │ • /api/admin/users       │  │
│  └───────┬────────┘  └────────┬────────┘  │ • /api/admin/logs        │  │
│          │                    │            └──────────┬──────────────┘  │
│  ┌───────▼────────────────────▼───────────────────────▼──────────────┐  │
│  │                      Service Layer                                │  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │  │
│  │  │ Helix Agent  │  │ STT/TTS      │  │ Settings &             │  │  │
│  │  │ Bridge       │  │ Proxy        │  │ Secrets Manager        │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────────────────────────┘  │  │
│  └─────────┼─────────────────┼───────────────────────────────────────┘  │
└────────────┼─────────────────┼──────────────────────────────────────────┘
             │                 │
     ┌───────▼──────┐  ┌──────▼───────┐
     │ BMC HELIX    │  │ EXTERNAL AI  │
     │ AI AGENTS    │  │ SERVICES     │
     │              │  │              │
     │ • Incidents  │  │ • OpenAI     │
     │ • Changes    │  │   Whisper    │
     │ • Knowledge  │  │ • OpenAI TTS │
     │ • Tools      │  │ • (optional) │
     │ • Streaming  │  │              │
     └──────────────┘  └──────────────┘
```

### Data Flow: End-to-End Voice Interaction

```
User speaks
    │
    ▼
Browser captures audio (MediaRecorder)
    │
    ├──► Option A: Web Speech API (browser-native STT, free)
    │        └──► Transcript text
    │
    ├──► Option B: Send audio blob via WebSocket to Python
    │        └──► Python proxies to OpenAI Whisper → Transcript text
    │
    ▼
Transcript sent to Python backend via WebSocket
    │
    ▼
Python sends message to BMC Helix AI Agent API
    │  (with session context, channel: "voice")
    │
    ▼
Helix Agent streams response tokens back
    │
    ▼
Python forwards token stream to frontend via WebSocket
    │
    ├──► Frontend displays tokens as live typing in chat
    │
    ├──► Sentence buffer detects complete sentences
    │        │
    │        ├──► Option A: Browser SpeechSynthesis (free, instant)
    │        │
    │        └──► Option B: Python proxies text to OpenAI TTS
    │                  └──► Audio bytes streamed back to frontend
    │
    ▼
User hears spoken response + sees it in chat
```

### Key Architecture Decisions

| Decision | Rationale |
|---|---|
| **WebSocket for voice sessions** | Bidirectional streaming needed for real-time STT/TTS/agent tokens |
| **Python FastAPI backend** | Native async/await, WebSocket support, excellent AI/ML ecosystem |
| **Next.js App Router** | Server components for dashboard, client components for voice UI |
| **Helix Agent as sole ITSM interface** | No direct Helix API calls from this app — agents handle all ITSM |
| **Admin panel as built-in route** | Single deployment, role-based access, no separate admin app |
| **PostgreSQL for persistence** | Sessions, users, settings, audit logs — mature, reliable |
| **Redis for real-time state** | Active session state, WebSocket pub/sub, rate limiting |

---

## 3. Technology Stack

### Frontend

| Technology | Purpose | Why This Choice |
|---|---|---|
| **Next.js 15** (App Router) | Framework | Server components for dashboard, client for voice; file-based routing |
| **React 19** | UI library | Hooks, Suspense, streaming SSR |
| **Tailwind CSS 4** | Styling | Utility-first, matches the clean design system in reference screenshots |
| **Framer Motion** | Animations | Agent orb animations, page transitions, micro-interactions |
| **shadcn/ui** | Component library | Beautiful, accessible, Tailwind-native components matching the reference aesthetic |
| **Zustand** | Client state | Lightweight, for voice/session state (not heavy enough for Redux) |
| **Lucide React** | Icons | Clean line icons matching the reference UI |

### Backend

| Technology | Purpose | Why This Choice |
|---|---|---|
| **Python 3.12+** | Language | AI/ML ecosystem, async support, rapid development |
| **FastAPI** | Framework | Native async, WebSocket support, auto-generated OpenAPI docs |
| **Uvicorn** | ASGI server | High-performance async server |
| **SQLAlchemy 2.0** | ORM | Async support, type-safe queries |
| **Alembic** | Migrations | Database schema versioning |
| **Pydantic v2** | Validation | Request/response schemas, settings management |
| **httpx** | HTTP client | Async HTTP for Helix Agent API calls |
| **Redis (via redis-py)** | Caching/pub-sub | Session state, rate limiting, WebSocket scaling |

### Database

| Technology | Purpose |
|---|---|
| **PostgreSQL 16** | Primary datastore — users, sessions, settings, audit logs |
| **Redis 7** | Ephemeral state — active sessions, rate limits, WebSocket pub/sub |

### External Services

| Service | Purpose | When Used |
|---|---|---|
| **BMC Helix AI Agent API** | All ITSM operations | Every user interaction |
| **OpenAI Whisper** | High-accuracy STT (optional) | When browser STT isn't accurate enough |
| **OpenAI TTS** | Natural voice synthesis (optional) | When browser TTS isn't good enough |
| **SMTP / SendGrid** | Email notifications | Session summaries, alerts |

---

## 4. Application Structure

### Frontend Route Map

```
/                           → Landing / Login
/dashboard                  → Session history, feedback reports (Screenshot 1-3)
/dashboard/sessions         → Session list with search and filters
/dashboard/sessions/[id]    → Session detail — feedback report + chat history tabs
/session/new                → Microphone test screen (Screenshot 4)
/session/[id]               → Active voice session (Screenshot 5)
/admin                      → Admin dashboard overview
/admin/agents               → Manage Helix AI Agent connections
/admin/voice                → STT/TTS provider configuration
/admin/users                → User management and roles
/admin/settings             → System settings (timeouts, defaults, branding)
/admin/api-keys             → API key management (Helix, OpenAI, etc.)
/admin/logs                 → Audit log viewer
/admin/analytics            → Usage analytics and cost tracking
```

### Backend Module Map

```
app/
├── main.py                      → FastAPI app factory, middleware
├── routers/
│   ├── auth.py                  → Login, logout, token refresh
│   ├── voice.py                 → WebSocket /ws/voice, /api/tts, /api/stt
│   ├── sessions.py              → Session CRUD, history
│   ├── admin/
│   │   ├── agents.py            → Helix Agent CRUD
│   │   ├── settings.py          → System settings
│   │   ├── users.py             → User management
│   │   ├── api_keys.py          → Encrypted API key management
│   │   ├── logs.py              → Audit log queries
│   │   └── analytics.py         → Usage metrics
│   └── health.py                → Health checks
├── services/
│   ├── helix_agent_bridge.py    → BMC Helix AI Agent API client
│   ├── stt_service.py           → STT provider abstraction (Whisper, etc.)
│   ├── tts_service.py           → TTS provider abstraction (OpenAI TTS, etc.)
│   ├── session_manager.py       → Session lifecycle, context, history
│   ├── secrets_manager.py       → Encrypted API key storage/retrieval
│   └── audit_logger.py          → Action logging for compliance
├── models/                      → SQLAlchemy models
├── schemas/                     → Pydantic request/response schemas
├── core/
│   ├── config.py                → Settings from env/db
│   ├── security.py              → JWT, hashing, RBAC
│   └── database.py              → DB engine, session factory
├── migrations/                  → Alembic migration files
└── tests/
```

---

## 5. Screen-by-Screen UI Specification

### Screen 1: Login

**Layout**: Centered card on a clean gradient background.

| Element | Behavior |
|---|---|
| App logo + title ("Helix Voice Assistant") | Top of card |
| Email / Username field | Standard input |
| Password field | With show/hide toggle |
| "Sign In" button | Primary coral/red — matches reference design accent color |
| "Sign in with Helix SSO" button | Secondary — OAuth/SAML flow to BMC Helix |
| Error message area | Below form, red text |

**Design Language**: White card, rounded corners (lg), subtle shadow, clean sans-serif font. Background uses a very subtle radial gradient (light gray to white) matching the reference screenshots.

---

### Screen 2: Dashboard — Session List & Feedback Report

**Reference**: Screenshots 1, 2, and 3 (Dashboard views)

**Layout**: Two-column. Left sidebar (280px fixed) + Right content area (fluid).

#### Left Sidebar

| Element | Behavior |
|---|---|
| **"Sessions" heading** | Fixed at top |
| **"New Session" button** | Coral/red pill button, top-right of heading — starts a new voice session |
| **Session cards** (scrollable list) | Each card shows: session title, date, duration, optional "Report" link, optional trophy count |
| **Active session card** | Blue left border, slightly elevated shadow — the selected session |
| **Trophies Earned section** | Fixed at bottom of sidebar, shows earned badge pills (e.g., "Detailed Communicator", "Tech Savvy") in pastel colors |

#### Right Content Area — Tab Bar

| Tab | Content When Active |
|---|---|
| **"Feedback Report"** (default) | Session overview card — see below |
| **"Chat History"** | Full conversation transcript — see below |

Active tab has a coral/red background with white text. Inactive tab has a light gray background.

#### Feedback Report Tab

For sessions with enough data:

| Element | Layout |
|---|---|
| **Session Overview header** | Icon + "Session Overview" + "Export PDF" button (top-right) |
| **Four insight cards** in 2x2 grid | Each card has a colored section label and paragraph text |
| Card 1: "SUMMARY" (coral label) | Brief session recap |
| Card 2: "STANDOUT STRENGTHS" (coral label) | What went well |
| Card 3: "KEY DEVELOPMENT AREAS" (coral label) | Areas to improve |
| Card 4: "RECOMMENDED FOCUS" (coral label) | Next steps |

For sessions too brief:

| Element | Layout |
|---|---|
| Empty state message | Centered: "Your session was too brief for a detailed report" |
| Suggestion text | "For best results, try having a longer conversation..." |

#### Chat History Tab

| Element | Behavior |
|---|---|
| "Chat History" heading | Top of content area |
| Message bubbles | Scrollable thread |
| Agent messages | Left-aligned, light purple/blue background, rounded, timestamp below |
| User messages | Right-aligned, light gray background, rounded, timestamp below |
| Timestamps | Small muted text, format "2:21:19 PM" |

---

### Screen 3: Microphone Test (Pre-Session Setup)

**Reference**: Screenshot 4 (Test Your Microphone)

**Layout**: Centered content, max-width ~900px, clean neutral background.

| Element | Behavior |
|---|---|
| **"Test Your Microphone" heading** | Large, centered, bold |
| **Subtitle** | "Enable your mic to begin the session" |
| **Three tips** (horizontal row) | Red dots + text: "Find a quiet space", "Test your mic levels", "Record & listen back" |
| **Audio Levels panel** (left card) | Waveform visualization bar, microphone device selector dropdown, "Turn on microphone" button (coral/red, full-width within card) |
| **3-Second Recording Test panel** (right card) | "Optional" badge top-right, instruction text, audio playback area (disabled until mic enabled), "Record" button (coral/red) + "Play" button (outlined, disabled until recorded) |
| **Bottom CTA bar** | Full-width muted bar: "Enable microphone to continue" — becomes active "Start Session" button once mic is enabled and tested |

**State progression**:
1. Initial: Mic off, both panels show placeholder state
2. Mic enabled: Audio levels animate, recording test becomes available
3. Test recorded: Play button enables, bottom CTA becomes "Start Session"
4. User clicks Start: Navigates to active session screen

---

### Screen 4: Active Voice Session

**Reference**: Screenshot 5 (Skill Builder Session — Active)

**Layout**: Full-width, three-section vertical layout: Header → Main Content (two-panel) → Controls Bar.

#### Session Header

| Element | Position | Behavior |
|---|---|---|
| **Session title** ("Voice Assistant Session") | Left | Bold heading |
| **Session ID** | Below title, small muted text | e.g., "ID: sess_abc123..." |
| **Connection quality badge** | Right area | Green "Excellent" / Yellow "Good" / Red "Poor" with bar icon |
| **Duration timer** | Far right | "Duration: 00:09" — counts up from session start |
| **Progress stages** | Center, horizontal stepper | Circles connected by lines: "Start" (completed/green) → "Core Interaction" (active/coral) → "Wrap Up" (pending/gray) |

#### Main Content — Left Panel: Agent Visualizer

| Element | Behavior |
|---|---|
| **"AGENT" label** | Top-left corner of panel |
| **Animated orb** | Centered in panel, ~250px diameter. Holographic gradient (teal/cyan/lavender/pink), smooth animated transitions between states |
| **State label below orb** | Text: "Listening" / "Thinking" / "Speaking" / "Idle" |
| **Agent name card** | Bottom of panel, small card: "AGENT" label + agent name (e.g., "Helix") |
| **Floating tip** | Below agent panel, dismissible: "Need more time to think? Mute your mic and type instead" with keyboard icon |

**Orb Animation States**:

| State | Visual Description |
|---|---|
| **Idle** | Slow, gentle gradient rotation. Low-energy pulse. Muted colors. |
| **Listening** | Active ripple rings expanding from center. Brighter gradient. Responsive to audio input level. |
| **Thinking** | Fast gradient spin. Orbiting particle dots. Slightly compressed/expanded pulsing. |
| **Speaking** | Smooth wave distortion on the orb surface. Equalizer-like bars at bottom. Bright, energetic gradient. |
| **Error** | Red tint wash over orb. Slow pulse. Error icon overlay. |

#### Main Content — Right Panel: Live Journey

| Element | Behavior |
|---|---|
| **"Live Journey" heading** | Top-left |
| **Interaction counter** | Below heading: "3 questions asked" |
| **Status badge** | Top-right: Animated "Listening" / "Thinking" / "Speaking" pill with animated dots |
| **Conversation thread** | Scrollable, auto-scrolls to newest message |
| **Current question card** | Highlighted card with blue left dot, "CURRENT QUESTION" label, question text, "Awaiting response" animated indicator |
| **Agent message bubbles** | Left-aligned, light purple/blue background |
| **User voice bubbles** | Right-aligned, with voice waveform icon indicator |
| **User typed bubbles** | Right-aligned, with keyboard icon indicator |
| **Message input field** | Bottom of panel, bordered input: emoji button (left), "Type a message..." placeholder, send button (right). Orange/coral border. |
| **Message legend** | Below input: "Completed" (green), "Active" (blue), "Agent" (purple), "Typed" (gray dots), "Voice" (waveform icon) |

#### Controls Bar (Bottom)

| Element | Position | Behavior |
|---|---|---|
| **Microphone button** | Left | Circular icon button — toggles STT on/off. Active state: pulsing coral ring |
| **Options chevron** | Next to mic | Dropdown: switch microphone device, adjust sensitivity |
| **Keyboard toggle** | Center-left | Square icon button — when active (highlighted), user is in type mode; when off, voice-only |
| **Speaker toggle** | Center-right | Circular icon button — mute/unmute TTS output |
| **"End Session" button** | Right | Coral/red pill button with X icon. Confirms before ending. |

**Control states**:
- Mic ON + Keyboard OFF = Voice-only mode (default)
- Mic OFF + Keyboard ON = Type-only mode
- Mic ON + Keyboard ON = Hybrid mode (voice primary, can type anytime)
- Speaker OFF = Text-only responses (no audio playback)

---

## 6. Admin Panel Design

### Admin Dashboard (`/admin`)

**Layout**: Standard admin layout — collapsible left nav, top header with user menu, content area.

**Overview Cards** (top row):

| Card | Data Shown |
|---|---|
| Active Sessions | Number of sessions currently in progress |
| Total Sessions (30d) | Session count with trend arrow |
| Avg. Session Duration | e.g., "8m 32s" |
| API Cost (30d) | Total spend on STT/TTS APIs |

**Charts** (below cards):

| Chart | Type |
|---|---|
| Sessions over time | Line chart — last 30 days |
| Top intents | Bar chart — most common voice queries |
| Voice vs. Text input ratio | Donut chart |
| API latency (P50/P95/P99) | Line chart |

---

### Admin: Agent Management (`/admin/agents`)

This is the most critical admin screen. It manages connections to BMC Helix AI Agents.

#### Agent List View

| Column | Content |
|---|---|
| Agent Name | e.g., "Incident Agent", "Knowledge Agent" |
| Endpoint URL | e.g., `https://helix.company.com/api/agent/incident` |
| Status | Green "Connected" / Yellow "Degraded" / Red "Disconnected" — live health check |
| Protocol | "HTTP SSE" / "WebSocket" / "REST" — auto-detected or configured |
| Last Used | Relative timestamp |
| Actions | Edit, Test Connection, Disable, Delete |

#### Agent Detail / Edit Form

| Section | Fields |
|---|---|
| **Basic Info** | Agent name, description, icon/avatar |
| **Connection** | Endpoint URL, Protocol (auto-detect / manual override), timeout (seconds), retry count |
| **Authentication** | Auth type dropdown: None, Bearer Token, API Key, OAuth2 Client Credentials. Fields shown dynamically based on selection. Token/secret fields masked with reveal toggle. |
| **Request Configuration** | Channel parameter name (default: `channel`), channel value (default: `voice`), custom headers (key-value pairs), request body template (JSON editor) |
| **Response Configuration** | Streaming mode: SSE / WebSocket / Polling / None. Token field path (e.g., `data.content`), done signal (e.g., `data.type == "done"`), error field path |
| **Voice Behavior** | Response style: "Concise for voice" / "Full detail" / "Custom instruction". Max response length for voice (chars). |
| **Routing Rules** | Keywords or patterns that route to this agent (e.g., "incident, ticket, INC*" → this agent). Priority (1-10). Default agent toggle. |
| **Health Check** | Health endpoint URL (optional), check interval, alert on failure toggle |
| **Test Panel** | Send a test message, see raw request/response, latency measurement. "Test Connection" button. |

---

### Admin: Voice Settings (`/admin/voice`)

| Section | Fields |
|---|---|
| **Speech-to-Text** | |
| Primary STT Provider | Dropdown: "Browser (Web Speech API)" / "OpenAI Whisper" / "Azure Speech" / "Google Speech" |
| Fallback STT Provider | Dropdown (same options), used when primary fails |
| Whisper Model | "whisper-1" (only option currently) |
| Language | Auto-detect / fixed language dropdown |
| ITSM Vocabulary Prompt | Text area — custom prompt for Whisper to improve ITSM term recognition (e.g., "INC, CRQ, SRQ, CMDB, CAB") |
| Silence Detection Threshold | Slider: 1.0s – 3.0s (default 1.5s) |
| **Text-to-Speech** | |
| Primary TTS Provider | Dropdown: "Browser (SpeechSynthesis)" / "OpenAI TTS" / "Azure Neural TTS" |
| OpenAI Voice | Dropdown: alloy, echo, fable, onyx, nova, shimmer (with audio preview for each) |
| OpenAI Model | "tts-1" (fast) / "tts-1-hd" (high quality) |
| Speaking Rate | Slider: 0.5x – 2.0x (default 1.0) |
| **General** | |
| Auto-listen after response | Toggle (default: on) — mic auto-activates after TTS finishes |
| Require mic test before session | Toggle (default: on) — shows microphone test screen |
| Max session duration | Minutes (default: 30) |
| Idle timeout | Minutes (default: 5) — end session if no interaction |

---

### Admin: API Key Management (`/admin/api-keys`)

| Column | Content |
|---|---|
| Service | "BMC Helix", "OpenAI", "Azure Speech", etc. |
| Key Name | User-defined label |
| Key (masked) | `sk-...****7f3a` |
| Status | Active / Revoked |
| Last Used | Timestamp |
| Created By | Admin username |
| Actions | Reveal (requires re-auth), Rotate, Revoke |

**Add New Key Form**:

| Field | Type |
|---|---|
| Service | Dropdown with predefined options + "Custom" |
| Key Name | Text |
| API Key / Secret | Password field (masked), paste-friendly |
| Environment | "Production" / "Staging" / "Development" |
| Notes | Optional text area |

All keys are encrypted at rest (AES-256) and only decrypted in-memory when used by the backend service layer.

---

### Admin: User Management (`/admin/users`)

| Column | Content |
|---|---|
| Name | Full name |
| Email | Login email |
| Role | "Admin" / "User" / "Viewer" |
| Status | Active / Suspended |
| Last Login | Timestamp |
| Sessions (30d) | Count |
| Actions | Edit, Suspend, Delete |

**Roles**:

| Role | Permissions |
|---|---|
| **Admin** | Full access — all admin screens, can manage users and keys |
| **User** | Can create/view own sessions, view dashboard. No admin access. |
| **Viewer** | Read-only — can view session history/reports but cannot start sessions. For managers reviewing team usage. |

---

### Admin: Audit Log (`/admin/logs`)

| Column | Content |
|---|---|
| Timestamp | ISO 8601, sortable |
| User | Who performed the action |
| Action | "session.created", "agent.queried", "incident.created", "setting.changed", "key.rotated", etc. |
| Resource | What was affected (session ID, incident ID, setting name) |
| Details | Expandable JSON — full request/response for ITSM mutations |
| Source | "voice" / "typed" / "admin" |

**Filters**: Date range, user, action type, resource type, source.

**Export**: CSV download for compliance reporting.

---

### Admin: Analytics (`/admin/analytics`)

| Metric | Visualization |
|---|---|
| Sessions per day/week/month | Line chart with trend |
| Average session duration | Bar chart by day |
| Voice vs. typed input ratio | Stacked area chart over time |
| Most common intents | Horizontal bar chart (top 20) |
| Agent usage distribution | Donut chart per agent |
| STT accuracy estimate | Percentage over time (based on corrections) |
| API cost breakdown | Stacked bar: Whisper, TTS, Agent API |
| User engagement | Table: top users by session count |
| Peak usage hours | Heatmap (hour of day vs. day of week) |
| Error rate | Line chart with threshold line |

---

## 7. Voice Pipeline Design

### Pipeline Stages

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. CAPTURE   │────►│  2. TRANSCRIBE│────►│  3. PROCESS   │────►│  4. RESPOND  │
│              │     │              │     │              │     │              │
│ MediaRecorder│     │ Web Speech   │     │ Helix Agent  │     │ TTS + UI     │
│ Audio blob   │     │ or Whisper   │     │ via Bridge   │     │ update       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### Stage 1: Audio Capture

- Browser's `MediaRecorder` API captures audio from the selected microphone
- Format: WebM/Opus (for Whisper) or raw PCM (for browser STT)
- Voice Activity Detection (VAD) monitors audio levels to auto-stop after configurable silence threshold
- Real-time audio level visualization drives the waveform in the mic test screen and the orb's listening animation

### Stage 2: Transcription (STT)

**Browser Path (Phase 1)**:
- `webkitSpeechRecognition` provides `interim` results (shown grayed) and `final` result
- Zero latency, zero cost, works offline
- Limitation: Chrome-dependent, weaker on ITSM jargon

**Server Path (Phase 2)**:
- Audio blob sent to Python backend via WebSocket binary frame
- Python forwards to OpenAI Whisper API with a vocabulary prompt for ITSM terms
- Higher accuracy, supports all browsers, costs $0.006/min

### Stage 3: Processing

- Transcript text sent to Python backend (if not already there from server STT)
- Python's Helix Agent Bridge formats the request and sends it to the configured Helix AI Agent
- Agent streams response tokens back
- Python forwards each token to the frontend via WebSocket

### Stage 4: Response

**UI Update**:
- Each token appends to the agent message bubble (live typing effect)
- Orb transitions from Thinking → Speaking on first token

**TTS (Sentence Buffer)**:
- A sentence boundary detector accumulates tokens until a sentence-ending punctuation is detected (`.` `!` `?`)
- Each complete sentence is dispatched to the TTS engine
- Sentences queue and play sequentially
- When the last sentence finishes, the orb returns to Idle or Listening

### Latency Budget

| Stage | Browser STT + Browser TTS | Whisper + OpenAI TTS |
|---|---|---|
| Audio capture → STT result | ~200ms | ~1500ms |
| STT → Python → Agent first token | ~500ms | ~500ms |
| Agent first token → first sentence complete | ~300ms | ~300ms |
| TTS start playing | ~100ms | ~800ms |
| **Total: user stops speaking → first spoken word** | **~1.1s** | **~3.1s** |

---

## 8. BMC Helix AI Agent Integration

### Integration Points

The Python backend connects to BMC Helix AI Agents via their exposed API. This is the only touchpoint with the Helix platform — the voice application does **not** directly call Helix ITSM APIs.

### What the Helix Agent Bridge Needs to Handle

| Capability | Description |
|---|---|
| **Authentication** | Obtain and refresh tokens for the Helix Agent API |
| **Message sending** | POST user messages with session context and `channel: "voice"` flag |
| **Streaming reception** | Parse SSE or WebSocket streams of agent response tokens |
| **Session management** | Create agent sessions, resume existing ones, end sessions cleanly |
| **Error handling** | Timeouts, connection drops, rate limits, authentication expiry |
| **Multi-agent routing** | Route user messages to the correct specialized agent based on intent or admin-configured routing rules |

### Agent Communication Protocol

The bridge is designed to be protocol-agnostic. The admin panel's Agent Management screen configures the protocol per agent. The bridge supports:

| Protocol | When Used | How It Works |
|---|---|---|
| **HTTP with SSE** | Most common | POST message, receive streaming response via Server-Sent Events |
| **WebSocket** | If agent supports bidirectional streaming | Persistent connection for full duplex |
| **HTTP Request/Response** | Legacy or simple agents | POST, wait for complete response (no streaming) |

### Voice Channel Adaptation

When the admin configures an agent, they specify a `channel` parameter. This tells the Helix Agent that the interaction is voice-based. The agent can use this to:

- Shorten responses (2-3 sentences instead of paragraphs)
- Avoid markdown formatting (no bullet lists, code blocks, tables)
- Use spoken-friendly phrasing ("incident one-two-three" vs "INC000123")
- Prioritize the most important information first

---

## 9. Data Model

### Core Entities

**Users**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | String | Unique, login identifier |
| name | String | Display name |
| password_hash | String | bcrypt hashed |
| role | Enum | admin, user, viewer |
| is_active | Boolean | Soft disable |
| created_at | Timestamp | |
| last_login_at | Timestamp | |

**Sessions**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key, also used as client-facing session ID |
| user_id | UUID | FK → Users |
| status | Enum | active, completed, abandoned, error |
| started_at | Timestamp | |
| ended_at | Timestamp | Nullable |
| duration_seconds | Integer | Computed on end |
| agent_id | UUID | FK → AgentConfigs — which agent was used |
| input_mode_stats | JSON | `{ voice_messages: 12, typed_messages: 3 }` |
| feedback_report | JSON | Nullable — generated on session end |

**Messages**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| session_id | UUID | FK → Sessions |
| role | Enum | user, agent, system |
| content | Text | Message text |
| input_mode | Enum | voice, typed, system |
| audio_duration_ms | Integer | Nullable — length of voice input |
| agent_actions | JSON | Nullable — tool calls made by agent |
| created_at | Timestamp | |

**AgentConfigs**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Display name |
| description | Text | |
| endpoint_url | String | Agent API URL |
| protocol | Enum | sse, websocket, rest |
| auth_type | Enum | none, bearer, api_key, oauth2 |
| auth_config | Encrypted JSON | Token, client_id, client_secret, etc. |
| request_template | JSON | Custom headers, body template |
| response_config | JSON | Token path, done signal, error path |
| routing_rules | JSON | Keywords, patterns, priority |
| is_default | Boolean | Used when no routing rule matches |
| is_active | Boolean | |
| health_status | Enum | connected, degraded, disconnected |
| last_health_check | Timestamp | |

**ApiKeys**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| service | String | "openai", "helix", "azure", "custom" |
| name | String | User-defined label |
| encrypted_key | Bytes | AES-256 encrypted |
| environment | Enum | production, staging, development |
| is_active | Boolean | |
| created_by | UUID | FK → Users |
| last_used_at | Timestamp | |

**AuditLogs**

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| timestamp | Timestamp | |
| user_id | UUID | FK → Users |
| action | String | Structured action name |
| resource_type | String | session, agent, setting, key, etc. |
| resource_id | String | |
| details | JSON | Full context |
| source | Enum | voice, typed, admin, system |

**SystemSettings**

| Field | Type | Notes |
|---|---|---|
| key | String | Primary key, dotted path (e.g., `voice.stt.provider`) |
| value | JSON | Flexible value |
| updated_by | UUID | FK → Users |
| updated_at | Timestamp | |

---

## 10. API Design

### REST Endpoints

**Authentication**

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Email + password → JWT |
| POST | `/api/auth/refresh` | Refresh token → new access token |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Current user profile |

**Sessions**

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions` | List user's sessions (paginated) |
| GET | `/api/sessions/{id}` | Session detail with messages |
| PATCH | `/api/sessions/{id}` | End session (status: completed) |
| GET | `/api/sessions/{id}/report` | Get or generate feedback report |
| GET | `/api/sessions/{id}/export` | Export as PDF/transcript |

**Admin: Agents**

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/agents` | List all agent configs |
| POST | `/api/admin/agents` | Create agent config |
| GET | `/api/admin/agents/{id}` | Agent detail |
| PUT | `/api/admin/agents/{id}` | Update agent config |
| DELETE | `/api/admin/agents/{id}` | Delete agent config |
| POST | `/api/admin/agents/{id}/test` | Test connection, returns latency + sample response |
| GET | `/api/admin/agents/{id}/health` | Current health status |

**Admin: Other**

| Method | Path | Purpose |
|---|---|---|
| GET/PUT | `/api/admin/settings` | Read/update system settings |
| CRUD | `/api/admin/users` | User management |
| CRUD | `/api/admin/api-keys` | API key management |
| GET | `/api/admin/logs` | Audit log (with filters) |
| GET | `/api/admin/analytics` | Usage metrics |

### WebSocket Endpoint

**`/ws/voice/{session_id}`** — The real-time bidirectional channel for voice sessions.

**Client → Server Messages**:

| Type | Payload | Purpose |
|---|---|---|
| `user_message` | `{ text, input_mode }` | Send transcribed text to agent |
| `audio_chunk` | Binary frame | Send audio for server-side STT |
| `stt_interim` | `{ text }` | Interim transcript (for server logging) |
| `control` | `{ action: "end_session" | "switch_agent" | ... }` | Session control |

**Server → Client Messages**:

| Type | Payload | Purpose |
|---|---|---|
| `agent_token` | `{ text }` | Streaming response token |
| `agent_thinking` | `{ tool_name }` | Agent is executing a tool |
| `agent_done` | `{ full_text, actions_taken }` | Response complete |
| `tts_audio` | Binary frame | Audio chunk for playback (server-side TTS) |
| `session_state` | `{ status, duration }` | Session state updates |
| `error` | `{ code, message }` | Error notification |

---

## 11. Authentication & Security

### Authentication Flow

| Method | How It Works |
|---|---|
| **Email + Password** | Standard login → JWT access token (15 min) + refresh token (7 days) |
| **Helix SSO** | OAuth2/SAML redirect to BMC Helix → callback with user identity → JWT issued |

### Security Measures

| Concern | Approach |
|---|---|
| API Key storage | AES-256 encryption at rest in PostgreSQL, decrypted only in-memory |
| JWT security | Short-lived access tokens, refresh rotation, stored in httpOnly cookies |
| WebSocket auth | JWT verified on connection upgrade, connection closed on token expiry |
| RBAC | Role-based middleware on all admin routes |
| Rate limiting | Redis-based, per-user, per-endpoint |
| CORS | Strict origin allowlist |
| Audit trail | Every ITSM mutation logged with user, timestamp, source (voice/typed/admin) |
| Audio data | Never persisted — transcribed in-memory, only text stored |
| Input sanitization | All user input sanitized before passing to agents (prompt injection prevention) |
| HTTPS | TLS required for all connections |
| WebSocket encryption | WSS (WebSocket Secure) only |

---

## 12. Phased Implementation Plan

### Overview

```
Phase 1 ────► Phase 2 ────► Phase 3 ────► Phase 4 ────► Phase 5
Foundation     Voice UI       Agent         Admin         Production
& Auth         & STT          Bridge        Panel         Hardening

Week 1-2       Week 3-4       Week 5-6      Week 7-8      Week 9-10
```

### Phase 1 — Foundation & Auth (Week 1-2)

| Task | Details |
|---|---|
| Project scaffolding | Next.js app, FastAPI app, Docker Compose for Postgres + Redis |
| Database setup | SQLAlchemy models, Alembic initial migration |
| Authentication | Login page, JWT flow, Helix SSO stub, role-based middleware |
| Layout shell | Dashboard layout (sidebar + content), admin layout (nav + content) |
| Dashboard — session list | Static UI with mock data, tab switching (Feedback Report / Chat History) |
| Dashboard — chat history | Message bubbles with mock conversation data |
| API scaffolding | Session CRUD endpoints, health check |

**Milestone**: User can log in, see mock dashboard with session history.

### Phase 2 — Voice UI & Browser STT (Week 3-4)

| Task | Details |
|---|---|
| Microphone test screen | Audio levels, device selector, recording test — matching reference design |
| Active session screen (layout) | Agent panel + Live Journey panel + Controls bar |
| Agent visualizer orb | Framer Motion animated orb with all 5 states |
| Web Speech API integration | STT service with interim/final results, VAD |
| Chat panel | Real-time message rendering, auto-scroll, input mode indicators |
| Controls bar | Mic toggle, keyboard toggle, speaker toggle, end session |
| Text input fallback | Type-to-send alongside or instead of voice |
| Browser TTS | SpeechSynthesis integration, sentence buffer, queue |
| WebSocket client | Connect to backend, send/receive messages |

**Milestone**: User can speak into mic, see transcript, get mock agent response spoken back.

### Phase 3 — Agent Bridge & Real Integration (Week 5-6)

| Task | Details |
|---|---|
| Helix Agent Bridge service | Python service that connects to Helix AI Agent API |
| SSE stream parser | Parse agent's streaming response into token events |
| WebSocket server | Bidirectional voice session channel in FastAPI |
| Session manager | Create/resume/end sessions, store messages in Postgres |
| Token forwarding | Agent tokens → WebSocket → frontend (live typing + TTS) |
| Agent routing | Route messages to correct agent based on configured rules |
| Error handling | Timeout, disconnect, retry logic |
| Session report generation | Generate summary/feedback on session end |

**Milestone**: End-to-end working — user speaks, Helix Agent responds, response is spoken aloud.

### Phase 4 — Admin Panel (Week 7-8)

| Task | Details |
|---|---|
| Admin dashboard | Overview cards + charts with real data |
| Agent management | Full CRUD, connection testing, health monitoring |
| Voice settings | STT/TTS provider configuration, saved to SystemSettings |
| API key management | Encrypted storage, reveal with re-auth, rotate/revoke |
| User management | CRUD, role assignment, suspend/activate |
| Audit log viewer | Filterable, sortable, exportable |
| Analytics page | Usage charts, cost tracking |

**Milestone**: Admin can configure agents, API keys, voice settings, and monitor usage.

### Phase 5 — Production Hardening (Week 9-10)

| Task | Details |
|---|---|
| OpenAI Whisper integration | Server-side STT for higher accuracy (optional upgrade) |
| OpenAI TTS integration | Server-side TTS for natural voice (optional upgrade) |
| Responsive design | Mobile, tablet, narrow viewport support |
| Keyboard shortcuts | Space to talk, Escape to cancel, Enter to send typed |
| Session export | PDF transcript, email summary |
| Rate limiting | Redis-based, configurable per-role |
| Error boundaries | Graceful degradation for every failure mode |
| Performance optimization | Code splitting, lazy loading voice modules |
| End-to-end testing | Playwright tests for critical flows |
| Documentation | Deployment guide, admin user guide, API docs |

**Milestone**: Production-ready application with admin panel, ready for deployment.

---

## 13. Deployment Architecture

### Docker Compose (Development / Single-Server)

```
┌──────────────────────────────────────────┐
│            Docker Compose                │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │  Next.js      │  │  FastAPI         │ │
│  │  (port 3000)  │  │  (port 8000)     │ │
│  └──────────────┘  └──────────────────┘ │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL   │  │  Redis           │ │
│  │  (port 5432)  │  │  (port 6379)     │ │
│  └──────────────┘  └──────────────────┘ │
└──────────────────────────────────────────┘
```

### Cloud Production

```
                    ┌──────────────┐
                    │  CDN / LB    │
                    │  (CloudFront │
                    │   or Nginx)  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐  ┌──▼──────────┐ │
       │ Next.js     │  │ FastAPI     │ │
       │ (Vercel or  │  │ (ECS/K8s,  │ │
       │  container) │  │  2+ replicas)│ │
       └─────────────┘  └─────┬───────┘ │
                               │         │
                    ┌──────────┼─────────┘
                    │          │
             ┌──────▼───┐  ┌──▼────────┐
             │ RDS       │  │ ElastiCache│
             │ Postgres  │  │ Redis     │
             └───────────┘  └───────────┘
```

### Environment Variables (Managed via Admin Panel or .env)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Signing key for JWT tokens |
| `ENCRYPTION_KEY` | AES-256 key for API key encryption |
| `HELIX_BASE_URL` | BMC Helix platform URL (for SSO) |
| `ALLOWED_ORIGINS` | CORS origin allowlist |

API keys for OpenAI, Helix Agents, etc. are managed through the Admin Panel, not environment variables — enabling runtime changes without redeployment.

---

## 14. Testing Strategy

### Test Pyramid

| Level | What | Tools | Coverage Target |
|---|---|---|---|
| **Unit** | Service functions, utilities, data transforms | pytest (Python), Vitest (Next.js) | 80% |
| **Integration** | API endpoints, DB operations, WebSocket flow | pytest + httpx, testcontainers | 60% |
| **Component** | React components, form validation, state | React Testing Library | 70% |
| **E2E** | Critical user flows (login → session → end) | Playwright | Top 5 flows |

### Critical Flows to E2E Test

1. Login → Dashboard → View session history
2. New Session → Mic test → Start session → Send typed message → Receive response → End session
3. Admin → Create agent → Test connection → Save
4. Admin → Add API key → Verify it's used in voice settings
5. Voice session → Speak → Transcript appears → Agent responds → Audio plays (requires browser audio mock)

---

## 15. Demo Scenarios

### Demo 1: "First-Time Setup" (3 minutes)

Walk through the admin panel:
1. Add BMC Helix AI Agent endpoint in Agent Management
2. Test connection — show green "Connected" status
3. Configure voice settings — select STT/TTS providers
4. Add OpenAI API key
5. Create a user account

**Message**: "Setup takes 5 minutes. No code, no config files."

### Demo 2: "Voice Incident Lookup" (2 minutes)

1. Open app → Dashboard → "New Session"
2. Microphone test screen — enable mic, test recording
3. Start session → Orb goes to Idle
4. Click mic → "What's happening with incident INC000123?"
5. Orb: Listening → Thinking → Speaking
6. Agent responds with incident details, spoken aloud
7. Follow-up: "Can you escalate that?"
8. End session → Dashboard shows session with chat history

**Message**: "Natural voice interaction with Helix — just like talking to a colleague."

### Demo 3: "Admin Monitoring" (90 seconds)

1. Open Admin → Analytics
2. Show session volume, top intents, cost breakdown
3. Open Audit Log → filter by "incident.created"
4. Show full audit trail of a voice-created incident

**Message**: "Full visibility. Every voice action is auditable."

### Demo 4: "Multi-Agent Routing" (2 minutes)

1. In Admin, show two configured agents: "Incident Agent" and "Knowledge Agent"
2. Show routing rules: "incident, ticket, INC" → Incident Agent; "how to, policy, process" → Knowledge Agent
3. Start a session
4. Say: "Show me critical incidents" → routed to Incident Agent
5. Say: "What's the change approval process?" → routed to Knowledge Agent
6. Same session, seamless switching

**Message**: "One voice interface, many specialized agents."

---

## 16. Future Enhancements

### Near-Term (Post-Launch)

| Enhancement | Description |
|---|---|
| **OpenAI Realtime API** | Replace separate STT + LLM + TTS pipeline with OpenAI's Realtime API for sub-500ms voice-to-voice latency |
| **Push-to-talk (Space bar)** | Power-user keyboard shortcut |
| **Session bookmarks** | User can mark important moments in a voice session for later review |
| **Custom orb themes** | Admin can upload custom orb animations / brand the visualizer |
| **Mobile PWA** | Progressive Web App for mobile voice access |
| **Slack/Teams integration** | Voice assistant available as a bot in messaging platforms |

### Medium-Term

| Enhancement | Description |
|---|---|
| **Multi-language** | Admin configures supported languages; STT/TTS auto-switch |
| **Voice authentication** | Speaker verification before sensitive ITSM actions |
| **Proactive notifications** | Push alerts for P1 incidents, SLA breaches — with spoken summary |
| **Team sessions** | Multiple users in one voice session (e.g., CAB meeting with AI assistant) |
| **Conversation analytics AI** | Auto-analyze sessions to surface common issues, training gaps |

### Long-Term

| Enhancement | Description |
|---|---|
| **Ambient listening mode** | NOC wall-mounted display — listens for incident mentions, auto-creates tickets |
| **Voice-defined automation** | "Every time a P1 is created, page the on-call" — spoken rules |
| **Digital twin voice interface** | "What happens if DB-PROD-01 goes down?" — CMDB simulation by voice |
| **Real-time translation** | Speak in any language, agent responds in that language, ITSM records in English |

---

## Appendix A — Design System Reference

### Color Palette (Extracted from Reference Screenshots)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#E85D4A` | Buttons, active tabs, accent — the coral/red from "New Session", "End Session" |
| `primary-light` | `#FFF0EE` | Hover states, light backgrounds |
| `secondary` | `#6C5CE7` | Agent orb accent, progress indicators — the purple from session steps |
| `secondary-light` | `#F0EDFF` | Agent message bubble background |
| `surface` | `#FFFFFF` | Cards, panels |
| `background` | `#F8F8FA` | Page background — the very light gray |
| `text-primary` | `#1A1A2E` | Headings, body text |
| `text-secondary` | `#6B7280` | Timestamps, subtitles, muted text |
| `success` | `#10B981` | Connected status, completed steps |
| `warning` | `#F59E0B` | Degraded status |
| `error` | `#EF4444` | Error states, disconnected |
| `border` | `#E5E7EB` | Card borders, dividers |

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page heading | Inter / system sans | 28px | Bold (700) |
| Card heading | Inter | 20px | Semibold (600) |
| Section label | Inter | 12px uppercase | Bold (700), coral color |
| Body text | Inter | 14-16px | Regular (400) |
| Timestamp | Inter | 12px | Regular (400), muted color |
| Button label | Inter | 14px | Medium (500) |

### Component Patterns

| Pattern | Description |
|---|---|
| **Cards** | White background, rounded-xl (12px), subtle shadow (`shadow-sm`), 24px padding |
| **Buttons (primary)** | Coral background, white text, rounded-full (pill shape), medium padding |
| **Buttons (secondary)** | White background, gray border, dark text, rounded-full |
| **Tabs** | Pill-shaped, active = coral bg + white text, inactive = gray bg + dark text |
| **Badge pills** | Rounded-full, pastel background + darker text (e.g., mint green bg + green text for "Tech Savvy") |
| **Input fields** | Rounded-lg, gray border, focus = coral border ring |
| **Message bubble (agent)** | Left-aligned, `secondary-light` background, rounded-xl with bottom-left square corner |
| **Message bubble (user)** | Right-aligned, light gray background, rounded-xl with bottom-right square corner |
| **Orb container** | Card with very light blue/teal gradient wash background, centered content |

---

## Appendix B — Cost Estimates

### Infrastructure (Cloud)

| Resource | Estimated Monthly Cost |
|---|---|
| Vercel (Next.js hosting) | $20-50 (Pro plan) |
| FastAPI server (2 vCPU, 4GB RAM) | $40-80 (ECS/Fargate or similar) |
| PostgreSQL (RDS small) | $30-50 |
| Redis (ElastiCache small) | $15-25 |
| **Infrastructure Total** | **~$105-205/month** |

### API Services (Usage-Based)

| Service | Usage (100 active users) | Monthly Cost |
|---|---|---|
| Phase 1: Browser STT + TTS | Unlimited | $0 |
| Phase 2: OpenAI Whisper | ~200 hrs/month | ~$72 |
| Phase 2: OpenAI TTS (tts-1) | ~1M chars/month | ~$15 |
| **Phase 1 API Total** | | **$0** |
| **Phase 2 API Total** | | **~$87/month** |

Helix AI Agent API costs are excluded — those are existing infrastructure.

---

## Appendix C — Key Decisions

| Decision | Rationale |
|---|---|
| Standalone app (not embedded in Helix) | Full UI control, no platform constraints, faster dev cycle |
| Next.js App Router | Server components for dashboard (SEO, fast load), client components for voice (interactivity) |
| Python FastAPI (not Node.js) | Better AI/ML ecosystem, native async, team expertise |
| WebSocket for voice sessions | Bidirectional streaming essential for real-time voice interaction |
| Admin panel built-in (not separate) | Single deployment, shared auth, consistent UX |
| PostgreSQL + Redis (not just Redis) | Relational data needs structured queries; Redis for ephemeral state |
| API keys in DB (not env vars) | Runtime management via admin panel without redeployment |
| Phase 1 uses browser-native STT/TTS | Zero API cost, instant results, validates UX before committing to paid APIs |
| Sentence-boundary TTS buffering | Speaks agent response as it streams, without waiting for full completion |
| Protocol-agnostic agent bridge | Works with SSE, WebSocket, or plain REST — adapts to whatever Helix agents expose |
