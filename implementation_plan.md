# 🎉 GigBuddy — Part-Time Job Finder App
### Product Requirements Document (PRD) — v2.0

---

## 📌 Overview

**GigBuddy** is a fun, cartoon-style part-time job finding platform for students and young people. Local businesses can post short-duration gigs (e.g., "Coffee shop mein 2 ghante ke liye banda chahiye") and students can discover and apply — all through a **game-like swipe UI**.

**Vision:** Not like LinkedIn (serious). More like a fun mobile game — swipe through jobs the way you swipe through Tinder cards.

---

## 🎯 Target Users

| Role | Description |
|------|-------------|
| **Job Seeker (Student/Youth)** | Students or freshers looking for short-duration gigs near them |
| **Job Poster (Local Business/Individual)** | Shop owners, cafes, book stalls, event organizers, tuition centers |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 17+ (Standalone Components, SCSS) |
| **Backend** | Java 17 + Spring Boot 3.x |
| **Database** | PostgreSQL |
| **Auth** | JWT (JSON Web Token) |
| **Styling** | SCSS + Custom Cartoon Design System |
| **Fonts** | `Fredoka One`, `Nunito` (Google Fonts) |
| **Build Tools** | Maven (Backend), Angular CLI (Frontend) |
| **API Docs** | Swagger / OpenAPI |

---

## 🎨 UI/UX Design Language — "Cartoon Game Vibes"

> [!IMPORTANT]
> This app must NOT look like a professional job portal. The UI should feel like a **fun mobile game** — cartoon-style, colorful, playful, and interactive.

### Design Principles

- **Chunky Bold Typography** — `Fredoka One` for headings, `Nunito` for body text
- **Bright Pastel Color Palette** — `#FFD93D` Yellow, `#6BCB77` Green, `#4D96FF` Blue, `#FF6B6B` Coral
- **Bubbly UI Elements** — `border-radius: 24px+`, thick `3px` cartoon borders, hard drop shadows
- **Micro-animations** — Cards bounce on hover, buttons wiggle on click, confetti on job apply
- **Mascot "Giggly"** — A cute cartoon character guiding users throughout the app

---

## 🃏 Core Interaction — Tinder-Style Swipe Cards

> [!IMPORTANT]
> The **Browse Gigs** screen is the heart of the app. Jobs are shown as a **stacked deck of swipeable cards** — just like a game!

| Swipe / Action | Result |
|----------------|--------|
| 👉 **Right Swipe** | Navigate to full Gig Detail page |
| 👈 **Left Swipe** | Skip — show next gig card |
| **Drag & Release** | Card flies off screen with rotation animation |
| **Green overlay** | Shows on right drag → "👀 VIEW" |
| **Red overlay** | Shows on left drag → "⏭️ SKIP" |
| **Button: 👀** | Same as right swipe (go to detail) |
| **Button: ⏭️** | Same as left swipe (skip) |

Cards are rendered in a **stacked deck** — the top card is draggable; cards below are visible with a depth/scale offset for a 3D stack feel.

---

## 📱 Key UI Pages

| Page | Status | Description |
|------|--------|-------------|
| **Home / Landing** | ✅ Built | Animated mascot, floating emoji decorations, preview cards, CTA to Browse |
| **Browse Gigs** | ✅ Built | Tinder-style swipe card stack, category filter tabs, skip/view action buttons |
| **Gig Detail** | ✅ Built | Full gig info, pay highlight, sticky Apply button, confetti + success toast on apply |
| **Post a Gig** | 🔲 Planned | Step-by-step fun form for employers |
| **Student Profile** | 🔲 Planned | Skills as sticker badges, past gigs, cartoon avatar |
| **Employer Profile** | 🔲 Planned | Business info, posted gigs, student ratings |
| **My Gigs** | 🔲 Planned | Timeline of applied/posted gigs |
| **Login / Signup** | 🔲 Planned | Role-select onboarding (Student vs Employer) |
| **Notifications** | 🔲 Planned | Animated cartoon bell, notification cards |

---

## 🗂️ Core Features

### Phase 1 — MVP

#### 1. 🔐 Authentication & User Roles
- Register as **Student** or **Employer**
- JWT-based login / logout
- Profile setup wizard (cartoon-style onboarding)

#### 2. 📋 Gig Posting (Employer Side)
- Title (e.g., "Coffee counter help chahiye!")
- Category: Cafe ☕ / Retail 🛍️ / Books 📚 / Events 🎉 / Tuition 📖 / Other
- Duration (2 hrs, 3 hrs, half day, full day)
- Date & time slots
- Location (city + area name)
- Pay per hour / fixed pay
- Number of people needed
- Short description + emoji support
- Optional photo upload

#### 3. 🃏 Gig Discovery — Swipe UI (Student Side)
- Tinder-style swipeable card stack
- Category filter tabs at top
- Right swipe → Gig detail; Left swipe → skip
- "Near Me" city-based filter
- Sort by: Newest, Pay High to Low, Duration

#### 4. ✅ Apply to Gig
- One-click Apply button (with 🎊 confetti animation!)
- Optional short message to employer
- Application status: `Pending → Accepted → Rejected`
- Max applications cap per gig (set by employer)

#### 5. 👤 Student Profile
- Name, age, location
- Skills shown as colorful sticker badges
- Short bio
- Past gigs completed (badge system)
- Cartoon avatar if no photo uploaded

#### 6. 🏪 Employer Profile
- Business name, type, location
- Posted gigs history
- Star rating (given by students after completion)

#### 7. 🔔 Notifications
- Application received (Employer)
- Application accepted/rejected (Student)
- New gig posted in preferred category (Student)

### Phase 2 — Enhanced Features

- **Gig Completion Verification** — QR code or OTP check-in
- **Review System** — Student rates employer ↔ Employer rates student
- **Saved Gigs** — Bookmark favourite gigs
- **Chat System** — Basic in-app messaging
- **Leaderboard** — Top gig workers of the month (gamification)
- **Badges & Achievements** — "Coffee Pro ☕", "Event Star 🎉", "Super Student 📚"
- **Referral System** — Invite a friend, earn coins

---

## 🗃️ Database Design

```
users
├── id, name, email, password_hash, role (STUDENT/EMPLOYER), created_at

student_profiles
├── id, user_id, skills[], bio, location, avatar_url, gigs_completed

employer_profiles
├── id, user_id, business_name, business_type, location, rating

gigs
├── id, employer_id, title, category, description, duration_hours,
│   date, time_slot, location, pay_amount, pay_type (HOURLY/FIXED),
│   slots_available, status (OPEN/CLOSED/COMPLETED), created_at

applications
├── id, gig_id, student_id, message, status (PENDING/ACCEPTED/REJECTED), applied_at

notifications
├── id, user_id, message, type, is_read, created_at
```

---

## 🔗 API Design (Spring Boot Endpoints)

### Auth APIs
```
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
```

### Gig APIs
```
GET    /api/gigs              → All gigs (with filters: category, location, pay, duration)
GET    /api/gigs/{id}         → Gig detail
POST   /api/gigs              → Post a gig (Employer only)
PUT    /api/gigs/{id}         → Update gig
DELETE /api/gigs/{id}         → Delete gig
GET    /api/gigs/my-posted    → Employer's posted gigs
```

### Application APIs
```
POST   /api/applications              → Apply to a gig
GET    /api/applications/my           → Student's applications
GET    /api/applications/gig/{gigId}  → Applications for a gig (Employer)
PUT    /api/applications/{id}/status  → Accept / Reject application
```

### Profile APIs
```
GET  /api/profile             → Get own profile
PUT  /api/profile             → Update profile
GET  /api/profile/{userId}    → View another user's profile
```

### Notification APIs
```
GET  /api/notifications          → Get all notifications
PUT  /api/notifications/{id}/read → Mark as read
```

---

## 📁 Project Structure

### Angular Frontend (`/SmallEarning`)
```
src/
├── app/
│   ├── components/
│   │   ├── swipe-card/       ✅ Built — drag/swipe card component
│   │   └── confetti/         ✅ Built — particle burst animation
│   ├── pages/
│   │   ├── home/             ✅ Built — landing page
│   │   ├── browse/           ✅ Built — swipe card stack page
│   │   └── gig-detail/       ✅ Built — gig detail + apply page
│   ├── services/
│   │   └── gig.service.ts    ✅ Built — mock gig data (to be replaced with API)
│   ├── models/
│   │   └── gig.model.ts      ✅ Built — Gig interface, GigCategory enum
│   ├── app.routes.ts         ✅ Configured (lazy-loaded routes)
│   └── app.component.ts      ✅ Root component with router outlet
├── styles.scss               ✅ Cartoon design system (colors, fonts, animations)
└── index.html                ✅ Meta tags, Google Fonts
```

### Spring Boot Backend (`/gigbuddy-backend`) — Planned
```
src/main/java/com/gigbuddy/
├── config/          → Security, JWT, CORS, Swagger
├── controller/      → REST controllers
├── service/         → Business logic
├── repository/      → JPA repositories
├── model/           → JPA Entity classes
├── dto/             → Request/Response DTOs
├── exception/       → Global exception handler
└── util/            → Helper classes
```

---

## 🧩 UI Component Library

| Component | Status | Description |
|-----------|--------|-------------|
| `<app-swipe-card>` | ✅ **Built** | Draggable card with pointer events, rotation, fly-out animation, directional overlays |
| `<app-confetti>` | ✅ **Built** | Confetti particle burst on apply / right swipe |
| `<gb-button>` | 🔲 Planned | Wiggle-on-hover cartoon button with emoji support |
| `<gb-badge>` | 🔲 Planned | Skill sticker badge (colorful pill) |
| `<gb-avatar>` | 🔲 Planned | Cartoon avatar with thick border |
| `<gb-mascot>` | 🔲 Planned | Giggly mascot in multiple poses |
| `<gb-tag>` | 🔲 Planned | Category tag (emoji + label) |
| `<gb-toast>` | 🔲 Planned | Cartoon-style toast notification |

---

## 🚀 Development Phases

### Phase 1 — Angular Frontend (COMPLETED ✅)
- [x] Angular 17 project setup (Standalone, SCSS, routing)
- [x] Global cartoon design system (fonts, colors, animations)
- [x] Gig data model & mock data service
- [x] Swipe Card component (drag, rotate, fly-out, right/left indicators)
- [x] Confetti component (particle animation on apply)
- [x] Home landing page (mascot, floating emojis, CTA)
- [x] Browse Gigs page (Tinder-style card stack, category filter)
- [x] Gig Detail page (full info, apply button, success toast)
- [x] App routing with lazy loading
- [x] Local Git commit

### Phase 2 — Spring Boot Backend (Next)
- [ ] Spring Boot project setup (Maven, dependencies)
- [ ] PostgreSQL database + JPA entity classes
- [ ] JWT Auth (register/login endpoints)
- [ ] Gig CRUD REST APIs
- [ ] Application management APIs
- [ ] CORS config + Swagger docs

### Phase 3 — Integration (Connect Frontend ↔ Backend)
- [ ] Replace mock GigService with real HTTP calls
- [ ] Angular HTTP interceptor (JWT auth header)
- [ ] Auth guards on protected routes
- [ ] Login / Signup pages
- [ ] Error handling + loading states

### Phase 4 — Remaining Pages & Polish
- [ ] Post a Gig page (employer)
- [ ] Student & Employer profile pages
- [ ] My Gigs timeline view
- [ ] Notifications page
- [ ] Mascot "Giggly" SVG illustrations
- [ ] Mobile responsive polish

### Phase 5 — Enhanced Features
- [ ] Review & rating system
- [ ] Saved/bookmarked gigs
- [ ] Badge & achievement system
- [ ] QR code / OTP gig check-in
- [ ] Leaderboard gamification
