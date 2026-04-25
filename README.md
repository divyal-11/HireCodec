# 🎯 HireCodec — Real-Time Technical Interview Platform

> A production-grade, 3D-inspired technical interview environment built with Next.js 14, featuring live code collaboration, anti-cheat detection, WebRTC video, and a full interviewer dashboard.

---

## 📸 What It Looks Like

| Screen | Description |
|---|---|
| **Login / Register** | 3D glassmorphism card with Google & GitHub OAuth buttons |
| **Dashboard** | Metric cards, recent interviews, quick actions |
| **Interview Room** | Split-pane: question + code editor + video + chat |
| **Questions Bank** | 150+ problems across Easy / Medium / Hard |
| **Interviews List** | Scheduled, Active, Completed with status badges |
| **Candidates List** | All candidates with interview history |
| **Analytics** | Pass rate, avg score, most-used questions |
| **Settings** | Profile, notifications, appearance |

---

## 🏗️ Project Architecture

```
hire codec/
├── apps/
│   └── web/                        ← Next.js 14 frontend
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/           ← Login page
│       │   │   └── register/        ← Register page
│       │   ├── (dashboard)/
│       │   │   ├── layout.tsx       ← Sidebar + dark mode toggle
│       │   │   ├── page.tsx         ← Main dashboard
│       │   │   ├── interviews/
│       │   │   │   ├── page.tsx     ← Interview list
│       │   │   │   ├── new/         ← Schedule new interview
│       │   │   │   └── [id]/        ← Interview detail view
│       │   │   ├── questions/
│       │   │   │   ├── page.tsx     ← Question bank (150+ questions)
│       │   │   │   └── [id]/        ← Question detail
│       │   │   ├── candidates/      ← Candidate management
│       │   │   ├── analytics/       ← Performance metrics
│       │   │   └── settings/        ← User settings
│       │   └── room/
│       │       └── [roomId]/        ← Live interview room
│       ├── components/
│       │   └── interview-room/
│       │       └── InterviewRoomStandalone.tsx  ← Core interview engine
│       ├── lib/
│       │   ├── theme.ts             ← Dark/light mode context
│       │   └── utils.ts             ← formatDate, generateRoomId, etc.
│       └── styles/
│           └── globals.css          ← Design tokens + component styles
├── packages/                        ← Shared packages (Turbo monorepo)
├── infrastructure/                  ← Deployment configs
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **Animations** | Framer Motion |
| **Layout** | react-resizable-panels |
| **Icons** | Lucide React |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Real-time (local)** | BroadcastChannel API |
| **Video** | WebRTC (RTCPeerConnection) + Google STUN |
| **Camera / Mic** | Web MediaDevices API (`getUserMedia`) |
| **Theme** | CSS Variables + Tailwind `dark:` variants |

---

## ✅ Features Built

### 🏠 Dashboard
- Metric cards: Total Interviews, Active, Pass Rate, Avg Score
- Recent interviews with quick "Join" links
- Quick action buttons (New Interview, Browse Questions)
- Animated entry with Framer Motion

### 🔐 Authentication
- Login + Register pages with 3D glassmorphism design
- Google OAuth + GitHub OAuth buttons
- NextAuth integration stub (ready to connect)
- Dark-mode native UI from the start

### 🎙️ Interview Room (`/room/[roomId]`)

#### Layout
- 3-panel split layout: **Question Panel | Code Editor | Right Panel**
- Fully resizable panels using `react-resizable-panels`
- Persistent header with timer, language selector, Run/Submit buttons

#### Question Panel
- 150+ questions in the room's question bank
- Single-page scroll (description + examples + constraints — no tabs)
- Markdown-like rendering: bold, inline code, line breaks
- Color-coded difficulty badges (Easy/Medium/Hard)
- Tag chips (arrays, dp, graphs, etc.)

#### Code Editor
- Candidate starts with a **blank editor** (no pre-filled code)
- Optional "Load Starter Code" template button
- Read-only mode for the interviewer (can view but not edit)
- Live character-by-character sync to interviewer via BroadcastChannel
- "Typing…" pulse indicator on interviewer's toolbar

#### Real-Time Sync (BroadcastChannel)
| Channel | Sender | Receiver |
|---|---|---|
| `CODE_SYNC` | Candidate (every keystroke) | Interviewer live view |
| `TIMER_TICK` | Interviewer (every second) | Candidate timer display |
| `CHAT` | Both | Both |
| `OUTPUT_SYNC` | Candidate (on Run/Submit) | Interviewer output panel |
| `CHEAT_EVENT` | Candidate browser | Interviewer notes tab |
| `WEBRTC_OFFER/ANSWER/ICE` | Both | Both |

#### Output Panel
- Candidate clicks **Run** → test case results appear on both screens
- Candidate clicks **Submit** → full submission synced to interviewer
- Interviewer sees live output even without touching the editor

#### Anti-Cheat System
| Event | Severity |
|---|---|
| Tab switched / window minimized | 🚨 ALERT |
| Window lost focus | ⚠️ WARN |
| Large paste (>20 chars) | 🚨 ALERT |
| Any paste | ⚠️ WARN |
| Right-click context menu | ⚠️ WARN |

Cheat log appears in interviewer's **Notes tab** with timestamps and auto-switches.

#### Video (WebRTC)
- **Two video tiles**: remote (large, top) + your own (small strip, bottom)
- WebRTC `RTCPeerConnection` with Google STUN server
- BroadcastChannel used as **signaling channel** (no backend needed for same browser)
- Bidirectional: both candidate AND interviewer send/receive video
- `onnegotiationneeded` auto-renegotiates when either side turns on camera
- Camera toggle: starts OFF, click 📷 to enable; green dot goes off when stopped
- Mic toggle: starts ON, click 🎤 to mute
- Mic-muted badge shown on your video tile

#### Chat
- Real-time cross-tab messaging via BroadcastChannel
- System welcome messages
- Timestamps on all messages
- Auto-scroll to latest message

#### Interviewer Panel (Notes Tab)
- CHEAT ALERTS badge counter (pulsing red when triggered)
- Timestamped cheat log with severity color coding
- Rating (1–5 stars)
- Hire / Reject decision buttons
- Free-text notes area

---

### 📚 Question Bank (`/questions`)
- **150+ questions** across all difficulty levels
- Filter by: search text, difficulty (Easy/Medium/Hard), tags
- Sortable list with attempt counts and pass rates
- Click any question → detail page with full description, examples, constraints

### 📋 Interviews List (`/interviews`)
- Table: title, candidate, schedule, status, actions
- Filter by status: All / Scheduled / Active / Completed / Cancelled
- Search by title or candidate name
- Color-coded status badges
- "Join Live" button for ACTIVE interviews
- Click row → full Interview Detail page

### 👤 Interview Detail (`/interviews/[id]`)
- Interview Details: scheduled date + duration
- Participants: interviewer + candidate names
- Assigned Questions with difficulty badges
- Invite Link with one-click copy

### 🧑‍🤝‍🧑 Candidates (`/candidates`)
- Table: name, email, interview count, last activity, status
- Search filter
- Status badges: active / scheduled / completed

### 📊 Analytics (`/analytics`)
- Metric cards: Total Interviews, Pass Rate, Avg Score, Avg Duration
- Interview Trend chart placeholder (ready for real data)
- Top 5 most-used questions with pass rates

### ⚙️ Settings (`/settings`)
- Profile section (name, email, role)
- Notification preferences
- Appearance (dark/light mode toggle)
- Account section (change password, delete account)

### 🌙 Dark / Light Mode
- Persisted in `localStorage` via `useTheme()` hook
- Applied as `.dark` class on `<html>`
- All pages use explicit `dark:` Tailwind variants
- Design tokens defined in `:root` and `.dark` in `globals.css`

---

## 📦 How to Run

```bash
# Install dependencies
pnpm install

# Start all apps (dev mode)
pnpm dev

# The web app runs at:
http://localhost:3000
```

---

## 🔗 URL Patterns

| URL | Description |
|---|---|
| `/` | Dashboard |
| `/login` | Login |
| `/register` | Register |
| `/interviews` | All interviews |
| `/interviews/new` | Schedule new interview |
| `/interviews/[id]` | Interview detail |
| `/questions` | Question bank |
| `/questions/[id]` | Question detail |
| `/candidates` | Candidate list |
| `/analytics` | Analytics |
| `/settings` | Settings |
| `/room/[roomId]?role=interviewer&name=John&qid=1` | Interview room (interviewer) |
| `/room/[roomId]?role=candidate&name=Alice&qid=1` | Interview room (candidate) |

---

## 🎮 How to Run an Interview (End-to-End)

1. Go to `/interviews/new` → fill in details → click **Schedule & Send Invite**
2. From the interviews list, click the interview → click **Join Room**
3. Share the candidate link from the room's **"Copy candidate link"** button
4. Candidate opens the link in a **new tab** (same browser)
5. Both tabs sync automatically via BroadcastChannel
6. Both turn on cameras → WebRTC peer connection established
7. Candidate writes and runs code → output syncs to interviewer
8. Interviewer watches live code, sees cheat alerts, takes notes
9. Candidate clicks **Submit** → final results appear on both screens
10. Interviewer rates, decides Hire/Reject, saves notes

---

## ⚠️ Known Limitations & Next Steps

| Feature | Current State | Production Fix |
|---|---|---|
| **Code Execution** | Mocked (simulated results) | Integrate Piston API / Docker sandbox |
| **Real-time (cross-device)** | BroadcastChannel (same browser only) | Add Socket.io WebSocket server |
| **WebRTC (cross-device)** | Needs TURN server for NAT traversal | Add Coturn / Twilio STUN+TURN |
| **Authentication** | UI only, no real sessions | Connect NextAuth + Google/GitHub OAuth |
| **Database** | Mock data in-memory | Prisma + PostgreSQL |
| **File persistence** | None | S3 for code submissions |
| **Notifications** | None | Email via SendGrid / Resend |

---

## 🛠️ Design System

### Colors (CSS Variables)
```css
/* Brand */
--color-primary: #6366F1  (Indigo)
--color-accent:  #22D3EE  (Cyan)
--color-success: #10B981  (Emerald)
--color-warning: #F59E0B  (Amber)
--color-danger:  #EF4444  (Red)

/* Editor (dark mode base) */
--editor-bg:      #0A0E14
--editor-surface: #111827
--editor-border:  #1F2937
--editor-text:    #E5E7EB
```

### Component Classes
```
.card          → rounded card with dark/light variants
.btn-primary   → indigo gradient button with glow
.btn-secondary → dark surface button
.btn-ghost     → transparent hover button
.input         → styled input with dark mode
.badge         → pill badge (easy/medium/hard/status)
.glass-card    → glassmorphism card
.gradient-text → animated gradient text
```

---

## 👨‍💻 Development Notes

- Run `pnpm dev` from the **root** of the monorepo (not inside `apps/web`)
- Camera requires `localhost` or `HTTPS` — it works on `localhost:3000` natively
- Interview room uses `BroadcastChannel('hirecodec-room-[roomId]')` for all sync
- The `role` param in the URL controls interviewer vs candidate view
- Anti-cheat is only active on the candidate tab

---

*README last updated: April 2026*
