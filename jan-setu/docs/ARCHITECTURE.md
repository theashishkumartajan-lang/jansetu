# JAN SETU — System Architecture

## Overview

JAN SETU is a full-stack AI-powered civic operating system built on Next.js 14+ with a true multi-agent AI architecture. The system transforms passive issue reporting into an autonomous resolution network powered by 10 specialized AI agents.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
├─────────────┬──────────────┬──────────────┬─────────────────────┤
│   Citizen   │  Government  │  Analytics   │     Community       │
│   Portal    │   Portal     │   Portal     │      Portal         │
└──────┬──────┴──────┬───────┴──────┬───────┴──────────┬──────────┘
       │             │              │                  │
       └─────────────┴──────┬───────┴──────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                         AI LAYER                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Report │ │Category│ │Severity│ │ Route  │ │ Trust  │       │
│  │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │ Fraud  │ │Escalate│ │ Verify │ │ Predict│ │Analytics│      │
│  │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                              │                                   │
│                    ┌─────────▼──────────┐                       │
│                    │   Orchestrator     │                       │
│                    │  (Pipeline Engine) │                       │
│                    └────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND LAYER                               │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ /api/  │  │ /api/  │  │ /api/  │  │ /api/  │  │ /api/  │   │
│  │ report │  │ issues │  │ verify │  │predict │  │escalate│   │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘   │
│  ┌────────┐  ┌────────┐  ┌────────┐                           │
│  │ /api/  │  │ /api/  │  │ /api/  │                           │
│  │agents/ │  │leader- │  │ issues │                           │
│  │analyze │  │ board  │  │ (GET)  │                           │
│  └────────┘  └────────┘  └────────┘                           │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                           │
│  Google Gemini API  │  Firebase Auth  │  Firestore  │  Next.js  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agent Workflow

```
Citizen Report (Image + Text + Voice + GPS)
        │
        ▼
┌───────────────┐
│  REPORT AGENT │  → Analyzes media, extracts issue description
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ CATEGORY AGENT│  → Classifies into 10+ categories (95%+ confidence)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ SEVERITY AGENT│  → Risk × Population × Traffic × Safety = Score
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  ROUTE AGENT  │  → Assigns to correct department + priority + ETA
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  TRUST AGENT  │  → Calculates citizen reputation score
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  FRAUD AGENT  │  → Validates authenticity, checks for spam
└───────┬───────┘
        │
        ▼ (if valid)
┌───────────────┐      ┌─────────────────┐
│PREDICTION AGENT│  +   │ ESCALATION AGENT│  → Monitors unresolved
└───────┬───────┘      └─────────────────┘
        │
        ▼
   Issue Created
        │
        ▼
┌─────────────────────────────────────────────┐
│  VERIFICATION AGENT (after repair)          │
│  → Compares before/after images with Gemini │
└─────────────────────────────────────────────┘
```

---

## Multi-Agent System

### Base Agent Interface
Each agent implements:
- `name`: Agent identifier
- `description`: What it does
- `process(ctx)`: Core logic receiving context, returning `AgentResult`

### Agent Orchestrator
- `runAgentPipeline(input)` → Runs all 8 core agents sequentially
- `runQuickAnalysis({image, text})` → Lightweight 2-agent analysis
- Returns: `{ results: Record<string, AgentResult>, summary: Partial<Issue> }`

### Gemini Integration
All agents use the Gemini 1.5 Flash API via `src/services/gemini/client.ts`:
- `analyzeWithGemini(input)` → Text + Image analysis
- `compareImages(before, after)` → Before/after verification
- `predictHotspots(data)` → Future hotspot prediction
- Mock mode: Deterministic responses when no API key is set

---

## Frontend Architecture

### Routes (App Router)
| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Landing page with hero, features, stats |
| `/citizen` | `src/app/citizen/page.tsx` | Citizen dashboard |
| `/citizen/report` | `src/app/citizen/report/page.tsx` | 4-step report wizard |
| `/government` | `src/app/government/page.tsx` | Government dashboard |
| `/analytics` | `src/app/analytics/page.tsx` | Public analytics + Digital Twin map |
| `/community` | `src/app/community/page.tsx` | Community portal + gamification |
| `/auth` | `src/app/auth/page.tsx` | Authentication page |

### State Management (Zustand)
- `currentUser`: Authenticated user with trust score, points, badges
- `issues`: All reported issues with full metadata
- `notifications`: Citizen notifications
- `predictions`: AI-generated hotspot predictions
- `mapState`: Center, zoom, filter for Digital Twin map

### Component Architecture
```
src/components/
├── layout/
│   ├── Navbar.tsx          # Sticky glassmorphism nav
│   └── Footer.tsx          # Site footer
├── shared/
│   ├── GlassCard.tsx       # Reusable glassmorphism card
│   └── StatusBadge.tsx     # Severity/status badges
├── agents/
│   └── AgentProcessingCard.tsx  # AI agent step visualization
├── voice/
│   └── VoiceRecorder.tsx   # Web Speech API voice input
├── map/
│   └── MapComponent.tsx    # Custom SVG-based Digital Twin
├── gamification/
│   └── TrustScoreRing.tsx  # SVG circular progress
└── dashboard/
    └── (analytics charts)  # Recharts components
```

---

## Backend API Routes

| Route | Method | Input | Output |
|-------|--------|-------|--------|
| `/api/report` | POST | `{image, text, voiceText, userId, location}` | Full agent pipeline results + issue |
| `/api/agents/analyze` | POST | `{image, text}` | Quick Report + Category analysis |
| `/api/issues` | GET | — | All mock issues |
| `/api/issues` | POST | Issue object | Created issue |
| `/api/verify` | POST | `{beforeImage, afterImage, issueId}` | Verification result |
| `/api/predictions` | GET | — | All predictions |
| `/api/escalations` | GET | — | Active escalations |
| `/api/leaderboard` | GET | — | Top contributors |

---

## Database Schema (Firestore-Ready)

### Collections

```
users/{userId}
  ├── name: string
  ├── email: string
  ├── trustScore: number
  ├── points: number
  ├── streak: number
  ├── badges: string[]
  ├── role: "citizen" | "government" | "admin"
  ├── avatar: string
  ├── area: string
  ├── reportsCount: number
  ├── verifiedCount: number
  └── joinedAt: timestamp

issues/{issueId}
  ├── userId: string (ref)
  ├── category: string
  ├── severity: "Low" | "Medium" | "High" | "Critical"
  ├── status: string
  ├── location: { lat, lng, address }
  ├── description: string
  ├── aiSummary: string
  ├── aiConfidence: number
  ├── imageUrl: string
  ├── department: string
  ├── trustScore: number
  ├── fraudScore: number
  ├── createdAt: timestamp
  ├── updatedAt: timestamp
  ├── resolvedAt: timestamp?
  ├── escalationLevel: number
  └── votes: number

predictions/{predictionId}
  ├── lat: number
  ├── lng: number
  ├── riskScore: number
  ├── category: string
  ├── confidence: number
  ├── reason: string
  └── timeframe: string

escalations/{escalationId}
  ├── issueId: string (ref)
  ├── level: number
  ├── triggeredAt: timestamp
  ├── department: string
  ├── supervisor: string
  ├── status: "Active" | "Resolved"
  └── notes: string

notifications/{notificationId}
  ├── userId: string (ref)
  ├── title: string
  ├── message: string
  ├── type: string
  ├── read: boolean
  ├── createdAt: timestamp
  └── actionUrl: string
```

### Indexes
- `issues`: `status` + `createdAt` (desc), `severity` + `createdAt`
- `issues`: `userId` + `createdAt` (desc)
- `issues`: `department` + `status`
- `escalations`: `status` + `level` (desc)
- `notifications`: `userId` + `read` + `createdAt` (desc)

---

## Security Rules (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own profile, write only their own
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Issues are publicly readable, creatable by authenticated users
    match /issues/{issueId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'government');
    }
    
    // Predictions publicly readable
    match /predictions/{predictionId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Deployment Architecture

```
┌────────────────────────────────────────┐
│              Vercel                     │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │  Next.js    │  │  API Routes     │  │
│  │  Frontend   │  │  (Serverless)   │  │
│  └─────────────┘  └─────────────────┘  │
└────────────────────────────────────────┘
           │                  │
           │                  ▼
           │         ┌─────────────────┐
           │         │  Google Gemini  │
           │         │  API            │
           │         └─────────────────┘
           ▼
    ┌─────────────────┐
    │  Firebase       │
    │  ├─ Auth        │
    │  ├─ Firestore   │
    │  └─ Storage     │
    └─────────────────┘
```

---

## Scalability Strategy

1. **Frontend**: Static generation + ISR for public pages, SSR for dashboards
2. **API**: Next.js API Routes → Vercel Edge Functions for low latency
3. **AI**: Gemini 1.5 Flash is cost-effective and fast for high-volume processing
4. **Database**: Firestore scales horizontally with automatic sharding
5. **Images**: Firebase Storage with CDN for report images
6. **Maps**: Custom SVG-based map (no API costs), ready for Google Maps swap

---

## Performance Targets

- Report submission: < 3 taps on mobile
- AI analysis: < 5 seconds for full pipeline
- Page load: < 2 seconds (Lighthouse 90+)
- API response: < 500ms for read operations
- Real-time updates: WebSocket for issue status changes

---

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gemini API rate limits | High | Implement caching, mock fallback, request batching |
| Fake/spam reports | Medium | Fraud Agent + Trust Score + community voting |
| Data privacy (images) | High | Auto-blur faces, EXIF stripping, GDPR compliance |
| Government adoption | High | Free tier, white-label, open-source core |
| Offline connectivity | Medium | PWA with offline queue, sync on reconnect |

---

## Future Roadmap

- **Phase 1 (MVP)**: Web app with mock data ✅
- **Phase 2**: Firebase integration, real auth, image storage
- **Phase 3**: Mobile app (React Native), push notifications
- **Phase 4**: WhatsApp bot, IVR voice reporting
- **Phase 5**: IoT sensor integration (smart city devices)
- **Phase 6**: AI chatbot for citizen support
- **Phase 7**: Cross-city federation, national dashboard

---

*Built to win. Designed to serve.*
