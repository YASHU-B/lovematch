# LoveMatch — Who Knows Who Better?
### Production-Oriented, Mobile-First Multiplayer Couples Quiz Website

LoveMatch is a modern, romantic, interactive quiz platform built for couples (dating, married, and long-distance) and best friends. Players answer questions privately on separate devices, reveal answers simultaneously, earn Love Sync Scores, and download story cards optimized for Instagram Stories and WhatsApp Status.

---

## 🌟 Key Features

1. **Mobile-First Experience**: Designed with touch targets ≥ 44×44px, safe area insets, 100dvh responsiveness, and zero layout shift from 320px phones to desktop monitors.
2. **Instant Guest Onboarding**: Play immediately without mandatory passwords, social logins, or app downloads. Anonymous cryptographic guest sessions manage access.
3. **Genuine Real-Time Multiplayer**:
   - Alternating roles: one player is the **Subject** (answers honestly for themselves), the other is the **Guesser** (predicts the partner's choice).
   - Strict privacy: Server-side validation conceals answers until **both** players submit.
   - Authoritative simultaneous reveal: Answers unlock at the exact same millisecond with match celebratory chimes and confetti bursts.
4. **Scoring Engine**:
   - 10 points per matched prediction.
   - Dynamic Love Sync Score (0–100%) and personalized relationship title ranks:
     - 90–100%: *Mind Readers*
     - 70–89%: *Perfectly in Sync*
     - 40–69%: *Still Discovering*
     - 0–39%: *Plot Twist!*
5. **Downloadable Result Cards**:
   - **Portrait** (1080 × 1920 px) for Instagram Stories and WhatsApp Status.
   - **Landscape** (1200 × 630 px) for messaging cards and social previews.
   - Direct PNG rendering via client-side `html-to-image` (zero expensive third-party image API needed).
6. **Curated 60+ Question Bank**:
   - 10 distinct categories: *Favourite Things*, *First Memories*, *Romantic Moments*, *Daily Habits*, *Food & Travel*, *Funny Couple Quirks*, *Long-Distance Love*, *Anniversary Edition*, *Personality & Mind*, and *Best Friends Mode*.
   - Includes all required seed questions (Biryani, First 'I love you', Dream trip, Jealousy, Happiness).
7. **Protected Admin Dashboard**: Add, edit, preview, and deactivate questions with secret key authorization.
8. **Dual-Mode Data Architecture**:
   - **Local Store**: Built-in in-memory / zero-config state store for instantaneous testing out-of-the-box.
   - **Supabase PostgreSQL & Realtime**: Ready migrations in `supabase/migrations/20261024000000_init_lovematch.sql` with RLS policies, tables (`rooms`, `players`, `questions`, `rounds`, `submissions`, `scores`, `share_tokens`), and automatic 24-hour expiration.
9. **PWA Ready**: Web app manifest and standalone display support.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with romantic color tokens and glassmorphism
- **Icons**: Lucide Icons
- **Celebration**: `canvas-confetti` + Web Audio API synthesized chimes
- **Image Generation**: `html-to-image`
- **Validation**: `zod`
- **Database & Realtime**: Supabase PostgreSQL + Supabase Realtime
- **Testing**: `vitest`

---

## 💻 MacBook Development Setup

### 1. Requirements
- macOS (Sonoma, Sequoia, or newer)
- Node.js v20+ or v22+ (tested on Node v24.13.0)
- npm v10+

### 2. Clone & Install
```bash
git clone https://github.com/your-username/lovematch.git
cd lovematch
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running Locally
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Multiplayer on Two Devices or Tabs

1. **Browser Tab 1 (Host)**:
   - Navigate to `http://localhost:3000`
   - Tap **"Create a Challenge"**
   - Enter your nickname (e.g. `Maya`) and click **"Create Private Room"**
   - Copy the 6-letter room code (e.g. `HEART8`)
   - Tap **"Enter Game Room"**

2. **Browser Tab 2 / Mobile Browser (Guest)**:
   - Open an incognito window or your phone browser on the same Wi-Fi
   - Navigate to `http://localhost:3000/join`
   - Enter the room code and your nickname (e.g. `Rohan`)
   - Tap **"Enter & Start Challenge"**

3. **Gameplay**:
   - Tab 1 will see their question as Subject; Tab 2 will see the prediction prompt as Guesser.
   - Once both tap **"Lock In Answer"**, both screens update simultaneously with the match animation, points, and sound!

---

## 🗄️ Supabase Setup (For Production Deployment)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261024000000_init_lovematch.sql` and run the script.
4. Copy your project credentials into `.env.local` or your Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`
5. In Supabase Dashboard -> **Database** -> **Replication**, enable Realtime on `rooms`, `players`, and `rounds`.

---

## 🚀 Vercel Deployment

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete LoveMatch multiplayer couples quiz app"
   git push origin main
   ```
2. Import repository in [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_APP_URL` = `https://your-domain.vercel.app`
   - `ADMIN_SECRET_KEY` = `<strong-random-key>`
   - `NEXT_PUBLIC_SUPABASE_URL` = `<your-supabase-url>`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY` = `<your-supabase-service-role-key>`
4. Deploy! Next.js will build with Turbopack and deploy worldwide with edge routing.

---

## 🧪 Automated Testing

Run the full automated test suite:
```bash
npm test
```

Run production linting:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```

---

## 📁 Project Structure

```
lovematch/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, ambient background & navbar
│   │   ├── globals.css               # Romantic color system, glassmorphism tokens
│   │   ├── page.tsx                  # Landing page with hero, live preview, FAQs
│   │   ├── play/page.tsx             # 10 categories & question count selection
│   │   ├── create/page.tsx           # Room creation & native share invitation
│   │   ├── join/page.tsx             # Room code join interface
│   │   ├── room/[code]/page.tsx      # Real-time multiplayer game & simultaneous reveal
│   │   ├── results/[roomId]/page.tsx # Love Sync Score & breakdown
│   │   ├── challenge/[token]/page.tsx# Shareable invite preview & 1-tap accept
│   │   ├── privacy/page.tsx          # Privacy policy & 24h retention rules
│   │   ├── terms/page.tsx            # Terms & conditions
│   │   ├── admin/page.tsx            # Protected question manager & JSON export
│   │   ├── manifest.ts               # PWA Web App Manifest
│   │   └── api/
│   │       ├── rooms/route.ts        # POST create room
│   │       ├── rooms/join/route.ts   # POST join room
│   │       ├── room/[code]/route.ts  # GET authorized room state
│   │       ├── room/[code]/submit/   # POST submit private answer
│   │       ├── room/[code]/next/     # POST advance round
│   │       ├── room/[code]/sync/     # GET realtime state synchronization
│   │       ├── results/[roomId]/     # GET verified game score
│   │       ├── challenge/[token]/    # GET public challenge preview
│   │       └── admin/questions/      # CRUD question bank
│   ├── components/
│   │   ├── BrandLogo.tsx             # Interlocking hearts brand logo
│   │   ├── Navbar.tsx                # Header with sound toggle & CTAs
│   │   ├── Footer.tsx                # Romantic footer with legal links
│   │   ├── HeartBackground.tsx       # Subtle floating romantic particles
│   │   ├── AudioEffects.tsx          # Web Audio API synthesizers
│   │   └── ResultCardPreview.tsx     # High-res Story (1080x1920) & Landscape (1200x630)
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts             # Supabase client initializer
│   │   │   ├── store.ts              # Server-authoritative GameStore
│   │   │   └── schema.ts             # TypeScript models
│   │   ├── questions/data.ts         # 60+ question bank & 10 categories
│   │   ├── scoring.ts                # Match evaluation & title scoring engine
│   │   └── tokens.ts                 # Cryptographic room codes & tokens
│   └── test/
│       ├── scoring.test.ts           # Scoring engine tests
│       ├── tokens.test.ts            # Token & sanitizer tests
│       ├── questions.test.ts         # Question bank & seed validation tests
│       └── room-flow.test.ts         # Multiplayer flow integration tests
├── supabase/
│   └── migrations/
│       └── 20261024000000_init_lovematch.sql # Complete PostgreSQL schema & RLS
├── .env.example
├── .env.local
└── package.json
```
