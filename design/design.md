# JAN SETU — Design System

## Vision
Bridge to the People. From Complaint to Resolution. An autonomous civic operating system that transforms passive reporting into active AI-driven problem solving.

## Visual Identity

### Color Palette
- Primary: `#0A2540` (Deep Navy — trust, authority, government)
- Accent: `#00D4AA` (Teal — action, resolution, success)
- Secondary: `#635BFF` (Purple — innovation, AI)
- Alert: `#FF6B6B` (Coral — critical issues, urgency)
- Warning: `#FFB800` (Amber — medium severity, pending)
- Background: `#F6F9FC` (Cool Gray — calm, clean)
- Card: `#FFFFFF` (White)
- Glass: `rgba(255, 255, 255, 0.08)` with `backdrop-filter: blur(20px)`
- Dark Surface: `#0F172A` (Slate 900)
- Gradient Hero: `linear-gradient(135deg, #0A2540 0%, #1A365D 50%, #0A2540 100%)`

### Typography
- Headings: `Inter` or `Geist` (font-sans)
- Body: `Inter`
- Mono: `Geist Mono` for data/IDs
- Scale: 72px hero, 48px h1, 36px h2, 24px h3, 16px body, 14px caption

### Effects
- Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl`
- Card Hover: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300`
- Gradient Borders: `bg-gradient-to-r from-[#00D4AA] to-[#635BFF] p-[1px] rounded-xl`
- Glow: `shadow-[0_0_40px_rgba(0,212,170,0.15)]`
- Pulse Animation: `animate-pulse` for live indicators

## Routes / Pages

| Route | Name | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero, features, demo, stats |
| `/citizen` | Citizen Dashboard | Reports, rewards, trust score, submit |
| `/citizen/report` | Report Issue | Multi-step form, voice, image, AI analysis |
| `/government` | Gov Dashboard | Assigned issues, metrics, escalations |
| `/analytics` | Public Analytics | City health, heatmap, predictions |
| `/community` | Community Portal | Leaderboard, badges, discussions |

## Components by Page

### Landing Page (Home)
- HeroSection: Gradient background, animated particles, title, subtitle, CTAs
- StatsBar: Live counters (reports, resolved, citizens, departments)
- FeatureGrid: 6 feature cards with glass effect
- HowItWorks: 4-step flow (Report → AI → Route → Resolve)
- DemoPreview: Embedded video/image carousel
- Testimonials: Citizen quotes
- CTA Footer: Join now

### Citizen Dashboard
- SidebarNav: Collapsible, glass effect
- WelcomeBanner: Name, trust score, points, streak
- QuickActions: Report button (prominent), view map, voice report
- MyReportsTable: Status, severity, AI analysis, progress
- RewardsCard: Points, badges, leaderboard preview
- TrustScoreCard: Score, history, factors
- NotificationsPanel: Escalations, verifications, rewards

### Report Issue Flow
- Step 1: Capture (Camera / Upload / Voice) — < 3 taps
- Step 2: AI Analysis (Live) — Show each agent processing
- Step 3: Review & Confirm — Pre-filled form, edit if needed
- Step 4: Success — Ticket ID, estimated resolution, share

### Government Dashboard
- OverviewCards: Pending, critical, overdue, resolved today
- IssuesTable: Filterable, sortable, assignable
- EscalationTimeline: Visual timeline of auto-escalations
- DepartmentMetrics: Efficiency, load, response time
- AI Recommendations: Predicted hotspots, resource allocation
- CommunicationPanel: Bulk notifications, citizen replies

### Analytics / Public Dashboard
- CityHealthScore: Big number + trend
- LiveMap: Colored pins (red/orange/green/blue for predicted)
- IssueTrendsChart: Line chart by category
- DepartmentEfficiency: Bar chart
- HeatmapLayer: Risk zones
- PredictionsPanel: Forecast cards with confidence
- CommunityEngagement: Participation metrics

### Community Portal
- Leaderboard: Top reporters, areas
- BadgeGallery: Earned and locked badges
- MyStats: Reports, verifications, points
- ActivityFeed: Recent activity
- TopContributors: Avatars, scores

## Shared Components
- GlassCard: Reusable glassmorphism card
- StatusBadge: Color-coded by status/severity
- SeverityIndicator: Dot + label
- TrustScoreRing: Circular progress indicator
- AIProcessingCard: Shows agent name, status, result
- VoiceRecorder: Mic button with waveform animation
- ImagePreview: Upload + preview + AI overlay
- MapComponent: Google Maps with custom markers
- ConfettiReward: Points earned animation
- NotificationToast: Sonner toast

## Responsive
- Mobile-first: All primary actions accessible in < 3 taps
- Tablet: 2-column layouts
- Desktop: Full dashboards with side-by-side panels

## Animation Language
- Page transitions: `fadeIn 0.3s ease-out`
- Cards: `hover:scale-[1.02] hover:shadow-2xl transition-all duration-300`
- AI Agent processing: Sequential reveal, typing effect, green checkmark
- Map pins: `bounceIn` on load, `pulse` for critical
- Numbers: `countUp` animation for stats
- Charts: Draw-on-enter

## Dependencies
- next, react, react-dom, typescript
- tailwindcss, @tailwindcss/postcss
- shadcn/ui (installed)
- lucide-react (icons)
- recharts (charts)
- framer-motion (animations)
- @react-google-maps/api (maps)
- firebase (auth, firestore)
- react-dropzone (file upload)
- date-fns (dates)
- html2canvas (screenshots)
- zustand (state)
- sonner (toasts)
