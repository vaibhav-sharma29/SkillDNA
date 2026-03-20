# SkillDNA - Behavioral Intelligence Platform

## 🚀 Quick Start

### Frontend
```bash
cd client
npm run dev
```
Opens at: http://localhost:5173

### Backend
```bash
cd server
node index.js
```
Runs at: http://localhost:5000

---

## 📁 Project Structure
```
SKILLDNA/
├── client/          # React + Vite + Tailwind + Framer Motion
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx          # Hero + Features + How it works
│       │   ├── CandidateSubmit.jsx  # GitHub profile submission
│       │   ├── Analysis.jsx         # SkillDNA report with charts
│       │   ├── RecruiterDashboard.jsx # Ranked candidates view
│       │   └── JobPost.jsx          # Post job requirements
│       └── components/
│           └── Navbar.jsx
└── server/          # Node.js + Express + MongoDB
    └── index.js
```

## 🎯 Demo Flow
1. Go to `/` — Landing page
2. Click "Post a Job" → `/post-job` — Recruiter posts job
3. Click "Candidate Submit" → `/candidate` — Enter GitHub username (try: `torvalds`, `gaearon`, `sindresorhus`)
4. Auto-redirects to `/analysis/:username` — Live GitHub analysis + SkillDNA scores
5. Go to `/recruiter` — See ranked candidates dashboard

## 🔑 GitHub Token (Optional but recommended)
Add your GitHub token in `server/.env` to avoid rate limits during demo.
Get one at: https://github.com/settings/tokens
