# JAN SETU — Bridge to the People

> **"From Complaint to Resolution"**

An AI-powered civic operating system that transforms passive issue reporting into an autonomous problem-solving network. Built for hackathons, designed for cities.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google)](https://ai.google.dev/)

---

## 🚀 What is Jan Setu?

Jan Setu is not another complaint portal. It is an **autonomous civic operating system** where AI actively helps communities solve problems rather than merely reporting them.

### The Old Way
```
Citizen → Report Issue → Government Receives → ... Wait ...
```

### The Jan Setu Way
```
Citizen → AI Understands → AI Validates → AI Prioritizes → AI Routes
       → AI Predicts → AI Explains → AI Escalates → Community Verifies → Resolution Tracked
```

---

## 🏗️ Architecture

### 10 AI Agents

| Agent | Responsibility |
|-------|---------------|
| **Report Agent** | Analyzes photos, videos, voice, and text reports |
| **Category Agent** | Classifies issues into 10+ categories with confidence |
| **Severity Agent** | Calculates risk, urgency, and public impact |
| **Route Agent** | Assigns to correct department with priority |
| **Trust Agent** | Maintains citizen reputation scores |
| **Fraud Detection Agent** | Detects spam, duplicates, and fake reports |
| **Escalation Agent** | Auto-escalates unresolved issues (3→7→15→30 days) |
| **Verification Agent** | Compares before/after images using Gemini Vision |
| **Prediction Agent** | Forecasts hotspots and future risk zones |
| **Analytics Agent** | Generates insights on trends and efficiency |

### Multi-Agent Pipeline
```
Report → Category → Severity → Route → Trust → Fraud → (if valid) → Prediction + Escalation Monitor
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS v4 |
| **UI** | shadcn/ui, Framer Motion, Lucide Icons |
| **Charts** | Recharts |
| **Maps** | Custom Digital Twin (SVG-based, no API key needed) |
| **AI** | Google Gemini 1.5 Flash (Vision + Text) |
| **State** | Zustand |
| **Backend** | Next.js API Routes |
| **Auth** | Google OAuth (ready for Firebase Auth) |
| **Database** | Firestore-ready (mock data for demo) |

---

## 🎨 Portals

- **Citizen Portal** — Report issues, track status, earn points, view trust score
- **Government Portal** — Manage issues, view escalations, department metrics, AI recommendations
- **Public Analytics** — City health score, issue trends, department efficiency, AI predictions
- **Community Portal** — Leaderboards, badges, activity feed, top contributors

---

## 🗣️ Features

- **Voice Copilot** — "There is a water leak near the bus stand" → Auto-transcribe, detect, create ticket, route
- **Multilingual** — English, Hindi, Marathi, Tamil, Telugu, Bengali
- **Digital Twin Map** — Live city map with color-coded markers (Red=Critical, Orange=High, Green=Resolved, Blue=Predicted)
- **Gamification** — Points, badges, leaderboards, streaks
- **AI Verification** — Before/after image comparison using Gemini Vision
- **Auto-Escalation** — 3→7→15→30 day automatic escalation rules
- **Hotspot Prediction** — AI forecasts future risk zones

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/jan-setu.git
cd jan-setu

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables (Optional)

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

> If no API key is provided, the system uses deterministic mock responses for demo purposes.

---

## 🏆 Hackathon Demo Script

### 2-Minute Wow Demo

1. **Landing Page** — Show the vision, live stats, 10 AI agents
2. **Report Flow** — Upload a pothole image → AI analyzes in real-time → Shows all 10 agents processing → Pre-filled form → Submit
3. **Citizen Dashboard** — Show trust score, badges, notifications, my reports
4. **Digital Twin** — Show live map with colored markers, click markers, filter by severity
5. **Government Dashboard** — Show pending/critical/overdue stats, department efficiency, escalation timeline
6. **Analytics** — City health score, charts, AI predictions with confidence scores
7. **Community** — Leaderboard, badges, activity feed

---

## 📁 Project Structure

```
jan-setu/
├── src/
│   ├── agents/              # 10 AI agents + orchestrator
│   ├── app/                 # Next.js App Router pages
│   │   ├── citizen/         # Citizen portal
│   │   ├── government/      # Government portal
│   │   ├── analytics/         # Public analytics
│   │   ├── community/         # Community portal
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth page
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── agents/            # Agent UI components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── gamification/      # Gamification components
│   │   ├── layout/            # Navbar, Footer
│   │   ├── map/               # Map component
│   │   ├── shared/            # GlassCard, StatusBadge
│   │   ├── voice/             # Voice recorder
│   │   └── ui/                # shadcn/ui components
│   ├── data/                  # Mock data
│   ├── hooks/                 # Custom hooks
│   ├── services/              # Gemini client
│   ├── stores/                # Zustand store
│   ├── types/                 # TypeScript types
│   └── lib/                   # Utilities
├── public/                    # Static assets
├── design/                    # Design system
├── docs/                      # Documentation
└── package.json
```

---

## 🎯 Google Technology Usage

| Google Service | Where Used |
|---------------|-----------|
| **Gemini API** | AI agents (Report, Category, Severity, Verification, Prediction) |
| **Gemini Vision** | Image analysis for reports, before/after comparison |
| **Google OAuth** | Auth page (ready for Firebase Auth) |
| **Google Maps** | Placeholder ready for Maps API integration |
| **Firebase** | Firestore schema, Auth ready (mock data for demo) |

---

## 🌟 Future Roadmap

- [ ] Firebase Auth integration
- [ ] Real Firestore database
- [ ] Push notifications
- [ ] Mobile app (React Native / Expo)
- [ ] Real-time WebSocket updates
- [ ] Advanced GIS analytics
- [ ] WhatsApp bot integration
- [ ] Integration with municipal ERP systems
- [ ] AI-powered chatbot for citizen support

---

## 🏅 Awards & Recognition

Built to win hackathons. Designed for real-world impact.

**JAN SETU — Bridge to the People.**

---

## 📝 License

MIT License — Built with AI for the People.

## 🙏 Acknowledgments

- Google AI Studio for Gemini API
- shadcn/ui for the design system
- The open-source community

---

> *"The best way to find yourself is to lose yourself in the service of others."* — Mahatma Gandhi
