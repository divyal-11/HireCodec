# 🎯 HireCodec — Real-Time Technical Interview Platform

> A full-stack technical interview platform with live code collaboration, WebRTC video calls, anti-cheat detection, role-based access control, and automated candidate invites.

**Live Demo:** [hirecodec.vercel.app](https://hirecodec.vercel.app) *(update after deployment)*

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS + Custom Design Tokens |
| **Animations** | Framer Motion |
| **Code Editor** | Monaco Editor (VS Code engine) |
| **Auth** | NextAuth.js (Credentials + Google OAuth) |
| **Database** | PostgreSQL (Supabase) + Prisma ORM |
| **Real-time** | Socket.io (WebSocket server) |
| **Video Calls** | WebRTC (RTCPeerConnection + STUN) |
| **Caching** | Redis (Upstash) |
| **Email** | Resend API |
| **Code Execution** | Piston API (sandboxed) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Deployment** | Vercel (web) + Railway (ws-server) |

---

## 🏗️ Project Structure

```
hire-codec/
├── apps/
│   ├── web/                          ← Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── register/         ← Register (role selection)
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/        ← Main dashboard
│   │   │   │   ├── interviews/       ← Schedule & manage interviews
│   │   │   │   ├── questions/        ← Question bank (150+)
│   │   │   │   ├── candidates/       ← Candidate list
│   │   │   │   ├── practice/         ← Practice arena
│   │   │   │   ├── analytics/        ← Interview metrics
│   │   │   │   └── settings/         ← User preferences
│   │   │   ├── room/[roomId]/        ← Live interview room
│   │   │   └── api/                  ← REST API routes
│   │   ├── components/
│   │   │   └── interview-room/       ← Core interview engine
│   │   └── lib/
│   │       ├── auth.ts               ← NextAuth config + RBAC
│   │       ├── email.ts              ← Email invite system
│   │       └── prisma.ts             ← Database client
│   └── ws-server/                    ← Socket.io signaling server
│       └── src/
│           ├── index.ts              ← Server entry
│           └── middleware/auth.ts     ← JWT auth middleware
├── packages/
│   └── db/                           ← Prisma schema & migrations
└── infrastructure/
    └── nginx/                        ← Production Nginx config
```

---

## ✨ Features

### Authentication & Authorization
- **Role-based registration** — Choose Interviewer or Candidate at signup
- **Google OAuth** + email/password login
- **RBAC enforcement** — Candidates can't access interview management, question creation, or analytics
- **JWT-based WebSocket auth** — Secure real-time connections

### Interview Management
- **Schedule interviews** with date, time, duration, and candidate details
- **Auto-generated invite tokens** — Each interview gets a unique, secure token
- **Email invites** — Candidates receive a styled HTML email with their join link
- **Copy candidate link** — One-click copy for sharing via other channels

### Live Interview Room
- **Split-pane layout** — Question panel | Code editor | Video/Chat panel
- **Monaco code editor** — Full syntax highlighting, 8 languages supported
- **Real-time code sync** — Interviewer sees candidate's code live via Socket.io
- **Code execution** — Run code against test cases using Piston API (sandboxed)
- **WebRTC video calls** — Peer-to-peer video with Google STUN servers
- **Live chat** — Real-time messaging between participants
- **Timer** — Countdown timer synced across participants

### Anti-Cheat Detection
| Event | Severity |
|---|---|
| Tab switch / window minimize | 🚨 ALERT |
| Window blur (lost focus) | ⚠️ WARNING |
| Large paste (>20 characters) | 🚨 ALERT |
| Right-click context menu | ⚠️ WARNING |

All events are logged with timestamps and shown to the interviewer in real-time.

### Room Security
- **Server-side authentication** — Room page validates session before rendering
- **Database verification** — Room must exist as a scheduled interview
- **Invite token validation** — Candidates need the correct token to join
- **No URL spoofing** — Role is derived from the user's database record, not URL params

### Practice Arena
- Solo coding practice mode (no auth required for room access)
- 150+ questions across Easy, Medium, and Hard difficulty

### Dashboard & Analytics
- Real-time stats from database (total interviews, completion rate, top questions)
- Upcoming and recent interview lists
- Candidate management view

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database (or [Supabase](https://supabase.com) free tier)

### Setup

```bash
# Clone the repo
git clone https://github.com/divyal-11/HireCodec.git
cd HireCodec

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, OAuth keys, etc.

# Push Prisma schema to database
pnpm --filter @hire-codec/db db:push

# Start development server
pnpm dev
```

The app runs at `http://localhost:3000`

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth session secret |
| `JWT_SECRET` | WebSocket authentication secret |
| `INTERVIEW_SECRET` | Invite token signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `REDIS_URL` | Redis connection URL (Upstash) |
| `RESEND_API_KEY` | Email service API key |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL |

---

## 🔗 URL Routes

| URL | Access | Description |
|---|---|---|
| `/` | Public | Login page |
| `/register` | Public | Registration with role selection |
| `/dashboard` | Authenticated | Main dashboard |
| `/interviews` | Interviewer only | Interview management |
| `/interviews/new` | Interviewer only | Schedule new interview |
| `/questions` | Interviewer only | Question bank |
| `/candidates` | Interviewer only | Candidate list |
| `/practice` | Authenticated | Solo practice arena |
| `/analytics` | Interviewer only | Performance metrics |
| `/room/[roomId]` | Authenticated + token | Live interview room |

---

## 🎮 How to Run an Interview

1. **Register** as an Interviewer at `/register`
2. **Schedule** an interview at `/interviews/new` — enter candidate's name and email
3. **Candidate receives** an email with a secure join link
4. **Interviewer clicks** "Join Live" from the interviews list
5. **Candidate clicks** the link from their email (or shared link)
6. **Both join** the interview room — video, code editor, and chat are live
7. **Candidate codes** — interviewer sees everything in real-time
8. **Anti-cheat** monitors tab switches, pastes, and focus loss
9. **Interviewer rates** the candidate, takes notes, and decides

---

## 🛠️ Design System

### Brand Colors
```
Primary:  #6366F1 (Indigo)
Accent:   #22D3EE (Cyan)
Success:  #10B981 (Emerald)
Warning:  #F59E0B (Amber)
Danger:   #EF4444 (Red)
```

### Component Classes
```
.card          — Dark/light card with border
.btn-primary   — Indigo gradient button with glow
.btn-secondary — Surface button
.input         — Styled input with dark mode
.badge         — Status/difficulty pill badge
.glass-card    — Glassmorphism card
```

---

## 📄 License

MIT

---

*Built by [Divya Surse](https://github.com/divyal-11)*
