# JAN SETU — Hackathon Demo Script

## "From Complaint to Resolution in 2 Minutes"

---

## Setup

1. Open browser to `http://localhost:3000`
2. Have a pothole image ready (or use the upload feature)
3. Ensure the screen is visible to judges

---

## Demo Flow (2 Minutes)

### 0:00 — 0:15 | Landing Page: The Vision

**Script:**
> "Jan Setu — Bridge to the People. We're not another complaint portal. We are an autonomous civic operating system where 10 AI agents actively help communities solve problems, not just report them."

**Actions:**
- Scroll through the landing page
- Point to the live stats bar (reports, resolved, citizens, departments)
- Highlight the 6 AI agent cards

**Wow Factor:** The gradient hero, animated stats, and glassmorphism design immediately signal premium quality.

---

### 0:15 — 0:45 | Voice Copilot: Just Say It

**Script:**
> "Most platforms require forms. Jan Setu has Voice Copilot. Just say: 'There is a water leak near the bus stand.' The AI transcribes, detects the issue, finds the location, and routes it — no typing needed."

**Actions:**
- Navigate to `/citizen/report`
- Show the Voice Recorder component with animated waveform
- Show the language support badges (English, Hindi, Marathi, Tamil, Telugu, Bengali)

**Wow Factor:** The voice input with real-time waveform animation feels futuristic.

---

### 0:45 — 1:15 | Report Flow: AI in Action

**Script:**
> "Let me show you the 10-agent pipeline. I'll upload a pothole image and describe the issue. Watch as each AI agent processes the report in real-time."

**Actions:**
1. Upload a pothole image (or any image)
2. Type: "Large pothole causing traffic accidents"
3. Click "Analyze with AI"
4. Watch the Agent Processing Cards animate sequentially:
   - Report Agent → Category Agent → Severity Agent → Route Agent → Trust Agent → Fraud Agent

**Script (during processing):**
> "Report Agent analyzes the image. Category Agent classifies it as a Pothole with 97% confidence. Severity Agent calculates risk score: Critical. Route Agent assigns it to Public Works with P0 priority. Trust Agent checks my reputation. Fraud Agent validates it's authentic."

**Wow Factor:** The sequential reveal of each agent with confidence scores and reasoning creates a powerful "AI at work" moment.

---

### 1:15 — 1:30 | Review & Submit

**Script:**
> "The AI pre-fills everything. I can edit if needed, but the AI got it right. One click to submit."

**Actions:**
- Show the pre-filled review form
- Point to auto-detected category, severity, department, priority
- Click Submit
- Show the success screen with ticket ID and points earned

**Wow Factor:** The entire flow from report to submission in under 3 taps. Points earned animation gamifies the experience.

---

### 1:30 — 1:45 | Digital Twin: The City Map

**Script:**
> "This is our Digital Twin — a live map of the city. Red markers are critical issues. Orange is high. Green is resolved. And these blue markers? Those are AI predictions of future hotspots before they happen."

**Actions:**
- Navigate to `/analytics`
- Scroll down to the Digital Twin Map
- Click on different colored markers
- Switch filter buttons: All → Critical → Resolved → Predicted

**Wow Factor:** The interactive map with pulsing critical markers and prediction markers feels like a command center.

---

### 1:45 — 2:00 | Government Dashboard: Intelligence

**Script:**
> "For government officials, we provide a complete command center. Pending issues, critical alerts, auto-escalation timeline, and AI recommendations like 'Shift crews to Public Works, pothole reports are up 40%.'"

**Actions:**
- Navigate to `/government`
- Show the overview cards (Pending, Critical, Overdue, Resolved)
- Show the Issues Table with filters
- Show the Escalation Timeline
- Show Department Efficiency metrics
- Show AI Recommendations card

**Wow Factor:** The escalation timeline and AI recommendations demonstrate true agentic intelligence, not just data display.

---

## Optional Extensions (if time permits)

### Community Portal (30 seconds)
> "Citizens earn badges, climb leaderboards, and build trust scores. Gamification drives engagement."
- Navigate to `/community`
- Show leaderboard, badges, activity feed

### Analytics Dashboard (30 seconds)
> "City health score, trend analysis, department efficiency — all powered by the Analytics Agent."
- Navigate to `/analytics`
- Show charts, predictions, city health score

### Verification (30 seconds)
> "After repair, citizens upload an after-image. The Verification Agent compares before/after using Gemini Vision and confirms the fix."
- Show the verification flow conceptually

---

## Key Messages to Emphasize

1. **"10 AI Agents, Not 1"** — This is a true multi-agent system, not a single AI model
2. **"Autonomous, Not Reactive"** — The AI predicts, escalates, and routes without human intervention
3. **"From Complaint to Resolution"** — Not just reporting, but actively solving
4. **"Built for Scale"** — Firebase + Google AI + Next.js = production-ready architecture
5. **"Designed for India"** — Multilingual, voice-first, mobile-optimized

---

## Closing Line

> "Jan Setu doesn't just digitize complaints — it transforms cities. Thank you."

**Pause. Smile. Wait for applause.**

---

## Backup Plan

If the AI pipeline takes too long:
- The mock mode responds instantly with deterministic results
- Demo with mock mode to guarantee speed
- Mention that real Gemini API can be swapped in with one environment variable

---

## Technical Talking Points (if judges ask)

- **"Why 10 agents?"** → Each agent has a single responsibility, making the system modular, testable, and debuggable. Like microservices for AI.
- **"How does it scale?"** → Next.js API routes + Firestore + Gemini Flash = serverless, auto-scaling, cost-effective.
- **"What about fake reports?"** → Fraud Agent + Trust Score + community verification. Three layers of defense.
- **"How accurate are predictions?"** → Historical pattern analysis + seasonal trends + equipment age. Confidence scores are always shown.
- **"What's the business model?"** → Free for citizens, SaaS for municipalities. Open-source core, premium features for large cities.

---

*Good luck. Win this.*
