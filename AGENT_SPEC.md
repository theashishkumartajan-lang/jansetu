# AGENT SPEC — JAN SETU Multi-Agent Coordination

## Shared Contract

### Stack
- Next.js 14+ App Router, TypeScript, Tailwind CSS v4
- shadcn/ui components (pre-installed)
- Zustand for state
- React Server Components where possible, Client Components for interactivity
- All files under `/src/...`

### Data Types (src/types/index.ts)
```typescript
export interface Issue {
  id: string;
  userId: string;
  category: IssueCategory;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Submitted' | 'AI_Processing' | 'Validated' | 'Routed' | 'Assigned' | 'In_Progress' | 'Resolved' | 'Verified' | 'Escalated';
  location: GeoLocation;
  description: string;
  aiSummary: string;
  aiConfidence: number;
  imageUrl?: string;
  beforeImage?: string;
  afterImage?: string;
  department: string;
  trustScore: number;
  fraudScore: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  escalationLevel: number;
  votes: number;
}

export type IssueCategory =
  | 'Pothole' | 'Garbage' | 'Water Leak' | 'Broken Streetlight'
  | 'Drainage Issue' | 'Graffiti' | 'Broken Sidewalk' | 'Fallen Tree'
  | 'Public Safety Hazard' | 'Traffic Signal Failure' | 'Other';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  trustScore: number;
  points: number;
  streak: number;
  badges: Badge[];
  role: 'citizen' | 'government' | 'admin';
  avatar?: string;
}

export type Badge = 'Civic Hero' | 'Road Guardian' | 'Water Warrior' | 'Community Champion' | 'AI Reporter';

export interface AgentResult {
  agent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number;
  output: Record<string, any>;
  reasoning?: string;
  timestamp: Date;
}

export interface Prediction {
  id: string;
  lat: number;
  lng: number;
  riskScore: number;
  category: IssueCategory;
  confidence: number;
  reason: string;
  timeframe: string;
}
```

### Agent Architecture
Each agent is a TypeScript module under `src/agents/<name>/index.ts` that exports:
```typescript
export interface Agent {
  name: string;
  description: string;
  process(input: any): Promise<AgentResult>;
}
```

Agents communicate via a central `AgentOrchestrator` in `src/agents/orchestrator.ts` that chains agents in sequence:
Report → Category → Severity → Route → Trust → Fraud → (if pass) → Escalation Monitor + Prediction

### State Management
Use `src/stores/app-store.ts` with Zustand for:
- Current user
- Active issues
- Selected issue
- AI processing state
- Notifications
- Map view state

### API Routes (src/app/api/)
- `/api/report` — POST new issue
- `/api/agents/analyze` — POST image/text, return agent results
- `/api/issues` — GET/POST issues
- `/api/verify` — POST before/after images
- `/api/predictions` — GET predictions
- `/api/escalations` — GET escalations
- `/api/leaderboard` — GET leaderboard

### Mock Data Strategy
All AI agents use deterministic mock responses for demo. When `NEXT_PUBLIC_GEMINI_API_KEY` is set, they call Gemini API. The mock system is in `src/services/gemini/mock.ts` and `src/services/gemini/client.ts`.

## Worker Assignments

### Worker 1 — AI Agent Layer
- Files: `src/agents/**/*.ts`, `src/app/api/agents/**`, `src/services/gemini/**`
- Build all 10 agents with mock + real Gemini integration
- Build the orchestrator

### Worker 2 — Citizen Portal + Voice + Report Flow
- Files: `src/app/citizen/**`, `src/app/citizen/report/**`, `src/components/voice/**`, `src/app/auth/**`
- Build citizen dashboard, report wizard, voice input, quick actions
- Build auth pages

### Worker 3 — Government + Analytics Dashboards
- Files: `src/app/government/**`, `src/app/analytics/**`, `src/components/dashboard/**`
- Build government portal, issue tables, escalation timeline, analytics charts
- Build public analytics page with recharts

### Worker 4 — Map + Gamification + Community
- Files: `src/app/community/**`, `src/components/map/**`, `src/components/gamification/**`, `src/app/**/page.tsx` (landing)
- Build Google Maps integration, gamification, community portal, landing page
- Build shared layout components (Navbar, Sidebar, Footer)

### Worker 5 — Core Infrastructure
- Files: `src/types/**`, `src/stores/**`, `src/data/**`, `src/services/firebase/**`, `src/lib/**`, `src/hooks/**`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Build types, store, mock data, hooks, layout, theme, landing page

## Merge Order
1. Worker 5 (Core Infrastructure) — must be merged first
2. Worker 1 (AI Agents) — depends on types
3. Worker 4 (Map + Gamification) — depends on store, types
4. Worker 2 (Citizen Portal) — depends on agents, map, auth
5. Worker 3 (Gov + Analytics) — depends on all above

## Validation
- `npm run build` must pass
- `npm run lint` should have no errors
- All pages render without errors
- Demo data populates all dashboards
