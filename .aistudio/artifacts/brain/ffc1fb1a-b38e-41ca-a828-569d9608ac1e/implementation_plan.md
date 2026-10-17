# Alumify — Higher-Ed Alumni Mentorship Platform

Alumify connects college students with verified alumni for transparent career mentorship, live 1-on-1 virtual coffee chats, and structured asynchronous resume and portfolio reviews, driven by an explainable rule-based matching engine.

> [!IMPORTANT]
> **Confirmed Product & Architectural Decisions**:
> - **Persistence & Demo Mode**: Client-side resilient local persistence (`localStorage` state repository with seeds and resets) accompanied by an instant persona switcher (Student, Alumni, Admin) and Supabase-ready PostgreSQL DDL/RLS export schema.
> - **Interaction Formats**: Hybrid mentorship workflow supporting both live 30-minute virtual video coffee chats (with availability slot booking) and asynchronous portfolio/resume reviews (with attachment simulation and structured rubric critique).
> - **Explainable Matching**: Deterministic, rule-based multi-factor scoring algorithm (0–100%) calculating career-goal compatibility, direct skill overlaps, industry relevance, and mentor availability with plain-English rationales.

---

## 1. Overview & Core Concept

- **What It Does**: Alumify bridges the gap between ambitious university students and working alumni. Students specify target roles, target industries, and skills to receive match scores with alumni mentors, explore rich alumni career journeys, send contextual mentorship requests, and track progress. Mentors manage their capacity, accept or decline requests, conduct reviews, and provide structured session notes. University administrators manage alumni verification badges and platform health.
- **Target Audience / Personas**:
  - **University Students**: Seeking industry guidance, resume critiques, mock interview tips, and job referral advice.
  - **Alumni Mentors**: Giving back to their alma mater, mentoring the next generation, and managing their weekly mentoring bandwidth.
  - **Institutional Administrators**: Ensuring verified alumni status (graduation year, degree, employment verification) to maintain trust and safety.
- **Key Value**: Replaces opaque LinkedIn cold outreach with high-trust, university-affiliated mentorship backed by clear compatibility rationales and structured meeting formats.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Smart Matching**:
   - Students browse verified alumni with multi-filter controls (Industry, Graduation Year, Company, Availability, Mentorship Format).
   - Each alumni card displays an interactive **Match Breakdown badge** revealing exact score components (e.g., *"94% Match: 3 overlapping skills (React, Node, Cloud Architecture), Target Industry (Fintech), Goal alignment"*).
2. **Mentorship Request & Booking**:
   - Student initiates a request choosing either **Live 1-on-1 Coffee Chat** (selecting from mentor's available weekly slots) or **Async Resume/Portfolio Review** (specifying goals, portfolio URL, and targeted questions).
   - Mentor receives notification in their alumni dashboard, reviews student profile and request details, and accepts or declines with personalized notes.
3. **Session & Outcome Tracking**:
   - Both parties track status transitions: `Pending` $\to$ `Accepted` $\to$ `Scheduled` / `In Review` $\to$ `Completed` (with mutual rating & takeaways).
4. **Admin Verification Center**:
   - Coordinators inspect pending alumni credentials (degree, graduation year, verified corporate email, LinkedIn profile) and grant or revoke verified badges with audit history.

### Visual Identity & Theme

- **Aesthetic Direction**: High-trust, contemporary academic SaaS with editorial warmth. Polished, spacious, and authoritative without feeling bureaucratic.
- **Color Palette (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Warm ivory / soft pearl background (`#FBFBF9` light canvas, `#101726` dark accents).
  - **30% Structural Surfaces**: Clean white cards (`#FFFFFF`) with subtle warm hairline dividers (`#E5E7EB` / `rgba(15, 23, 42, 0.08)`) and deep navy typography (`#0F172A`).
  - **10% Intentional Accents**: Deep collegiate teal (`#0D9488` / `#0F766E`) for primary interactive CTAs and active states, paired with restrained energizing lime/emerald accents (`#10B981` / `#84CC16`) strictly for match badges and verified alumni shields.
- **Typography & Scale**:
  - **Display / Headings**: *Plus Jakarta Sans* / *Outfit* with bold, confident line-weights and balanced text wraps.
  - **Body Prose**: Clean, legible modern sans (*Plus Jakarta Sans* / *DM Sans*) with $1.5\text{--}1.6$ line-height.
  - **Data, Scores & Metrics**: Monospace tabular numerals (`tabular-nums font-mono`) for match scores, dates, and session durations.
- **Zero-Pill & Metadata Discipline**:
  - Clean unboxed metadata with subtle typographic bullet separators (`Product Designer · Stripe · Class of '20 · 2 Slots Open`).
  - Strict absence of pseudo-code headers (`//`), pulsing green eye-candy dots, or low-opacity watermark slogans.

---

## 3. Key Product Decisions & Trade-Offs

- **Deterministic Rule-Based Matching vs. Black-Box AI**:
  - *Chosen Approach*: Explainable scoring formula combining weighted dimensions:
    - **Skills Overlap (40%)**: Jaccard similarity and direct matching between student desired skills and mentor expertise.
    - **Career Goal Alignment (30%)**: Target role match with mentor current or past roles.
    - **Industry Relevance (20%)**: Sector alignment (e.g., Software, Biotech, Finance).
    - **Mentor Bandwidth & Availability (10%)**: Active availability slots and current student request quota.
  - *Why*: Transparent rationale instills trust; students understand *why* someone is a 95% vs. 60% match and can tailor their request note accordingly.
- **Instant Persona Switcher vs. Rigid Single-User Auth**:
  - *Chosen Approach*: Interactive Top Bar persona drawer allowing instant switching between:
    - **Maya Lin (Computer Science Junior, Student Persona)**
    - **David Chen (Senior Engineering Lead @ Datadog, Verified Alum Persona)**
    - **Dr. Sarah Jenkins (University Career Center Director, Admin Persona)**
    - Plus real Custom Account Sign-Up/Sign-In and full data reset capabilities.
  - *Why*: Allows immediate, friction-free evaluation of all multi-party mentorship workflows without multi-browser account dance.
- **Hybrid Mentorship Formats**:
  - *Chosen Approach*: Distinct request modals for Live Virtual Chats (calendar selection, video call link simulation) and Async Critiques (rubric, attachments, critique response editor).
  - *Why*: Busy alumni often decline 30-min calls but gladly provide 10-minute async resume feedback, drastically boosting request fulfillment rates.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Alumify Application Root                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ TopBar Contract: [Brand Wordmark] · [Navigation Links] · [Role CTA] │ │
│ │ Demo Persona Switcher Banner (Student · Alum · Admin · Data Reset) │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                   │                                    │
│       ┌───────────────────────────┼───────────────────────────┐        │
│       ▼                           ▼                           ▼        │
│ ┌───────────────┐        ┌───────────────────┐       ┌───────────────┐ │
│ │ Student Views │        │   Alumni Views    │       │  Admin Portal │ │
│ ├───────────────┤        ├───────────────────┤       ├───────────────┤ │
│ │ · Directory   │        │ · Inbound Requests│       │ · Verification│ │
│ │ · Profile Edit│        │ · Availability Set│       │ · Alumni List │ │
│ │ · Request Log │        │ · Profile Editor  │       │ · Safety Audit│ │
│ │ · Match Modal │        │ · Review Response │       │ · Stats Desk  │ │
│ └───────────────┘        └───────────────────┘       └───────────────┘ │
│                                   │                                    │
│       ┌───────────────────────────┴───────────────────────────┐        │
│       ▼                                                       ▼        │
│ ┌──────────────────────────────────┐        ┌────────────────────────┐ │
│ │ Explainable Matching Engine Core │        │ Local Storage State DB │ │
│ │ · Skill Intersection & Gaps      │        │ · Users & Profiles     │ │
│ │ · Career Trajectory Weighting    │        │ · Mentorship Requests  │ │
│ │ · Bandwidth & Slot Calculator    │        │ · Supabase SQL Export  │ │
│ └──────────────────────────────────┘        └────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State

- `UserProfile`: ID, name, email, avatar, role (`student` | `alumni` | `admin`), bio, university, graduationYear, linkedinUrl, createdAt.
- `StudentProfile`: targetRoles, targetIndustries, learningGoals, skillsToLearn, currentMajor, degreeLevel.
- `AlumniProfile`: currentTitle, company, industry, yearsExperience, verifiedStatus (`verified` | `pending` | `unverified`), verificationDocuments, expertiseSkills, availableFormats, weeklySlotCount, bioSummary.
- `MentorshipRequest`: id, studentId, mentorId, format (`video_chat` | `async_review`), topic, message, targetOutcome, resumeUrl, status (`pending` | `accepted` | `declined` | `completed`), scheduledAt, meetingLink, mentorFeedback, createdAt.
- `MatchExplanation`: score (0–100), breakdown (skillsMatch, industryMatch, roleMatch, availabilityMatch), highlightedOverlaps, skillGaps.

---

## 5. Implementation Sequence & Plan

1. **Design Tokens & Shell**:
   - Warm ivory canvas, Tailwind CSS configuration, typography, and responsive Top Bar with role switcher.
2. **State Store & Seed Data**:
   - Typed local repository with reactive state, initial realistic alumni/student datasets, and Supabase SQL schema generator.
3. **Matching Engine**:
   - Explainable scoring module with transparent weight breakdown and skill tag overlap analysis.
4. **Alumni Discovery & Profile Detail**:
   - Fast client-side search, multi-faceted filtering, verified badge indicators, and detailed profile modal with match breakdown.
5. **Interactive Request Modals**:
   - Dual-workflow request modal: Live 1-on-1 booking with time slots & async resume review submission.
6. **Student & Alumni Dashboards**:
   - Status pipeline cards, incoming request approval/rejection with notes, and completed session history.
7. **Admin Verification Desk & SQL Exporter**:
   - Coordinator dashboard to approve/reject verification requests, and Supabase DDL/RLS copy tool for production deployment.
