<div align="center">

# 🧬 SkillDNA

### Post-Resume Era Talent Intelligence

**Hire on real proof. Not polished PDFs.**

SkillDNA analyzes a developer's GitHub activity, cross-verifies resume claims with AI, and ranks every applicant by verified skill — transparently and without bias.

<br/>

![Built with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq_AI-LLaMA_3.3_70B-a78bfa?style=for-the-badge)

*Built for **Techkriti '26 × Eightfold AI** Hackathon*

</div>

---

## The Problem

Generative AI has created a **"Synthetic Candidate" crisis**. Applicants use AI to generate polished resumes and auto-complete GitHub profiles — making it nearly impossible for recruiters to distinguish genuine skill from AI-inflated applications.

SkillDNA solves this by going **evidence-first**: we analyze what a developer actually *built*, not what they *claimed*.

---

## How It Works

```
Candidate submits GitHub username + Resume PDF
              ↓
   GitHub REST API → Signal Extraction
   (repos, commits, languages, complexity, activity)
              ↓
   pdf2json → Resume Text Extraction
              ↓
   Groq AI — LLaMA 3.3 70B
   ├── Score candidate vs Job Description (0–100)
   ├── Verify resume claims vs GitHub evidence
   └── Bias check (parallel scoring with/without identity)
              ↓
   MongoDB → Store jobs + applications
              ↓
   Recruiter Dashboard → Ranked leaderboard + Full reports
```

---

## Key Features

| Feature | Description |
|---|---|
| 🔍 **GitHub Deep Scan** | Live fetch of repos, commits, languages, complexity level, stars, activity recency |
| 🤖 **AI Match Scoring** | Groq LLaMA 3.3 matches candidate signals against job description → explainable 0–100 score |
| 📄 **Resume Verification** | AI cross-checks every resume skill claim against actual GitHub evidence |
| ⚖️ **Bias Detection** | Two parallel AI calls (with/without identity) — flags if score shifts by >5 points |
| 🫥 **Anonymize Mode** | One-click toggle blurs name/photo — score stays mathematically identical |
| 📊 **Ranked Leaderboard** | All applicants auto-sorted by verified score with radar charts + language graphs |
| 💡 **Glass-Box Scoring** | Every score explains itself — matched skills, missing skills, top strength, risk flag |

---

## Tech Stack

```
Frontend    →  React + Vite + Tailwind CSS + Framer Motion + Recharts
Backend     →  Node.js + Express.js
AI Engine   →  Groq API (LLaMA 3.3 70B Versatile)
Data Source →  GitHub REST API
Database    →  MongoDB + Mongoose
Resume      →  pdf2json
```

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/vaibhav-sharma29/SkillDNA.git
cd SkillDNA
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GITHUB_TOKEN=your_github_token_optional
```

```bash
node index.js
# Runs at http://localhost:5000
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
# Runs at http://localhost:5176
```

---

## Project Structure

```
SkillDNA/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx          # Hero, features, how-it-works
│       │   ├── Jobs.jsx             # Candidate job listings
│       │   ├── Apply.jsx            # Application form + AI pipeline
│       │   ├── PostJob.jsx          # Recruiter job posting
│       │   └── RecruiterDashboard.jsx  # Ranked candidates + full reports
│       └── components/
│           ├── Navbar.jsx
│           └── AIThinkingPanel.jsx  # Live AI step indicator
└── server/
    ├── index.js
    └── routes/
        ├── github.js    # GitHub API signal extraction
        ├── analyze.js   # Groq AI scoring + ranking
        ├── bias.js      # Parallel bias detection
        ├── resume.js    # PDF parsing + verification
        └── jobs.js      # Job + application CRUD
```

---

## Demo Flow

1. **Recruiter** → `/recruiter/post-job` — Post a job with required skills
2. **Candidate** → `/jobs` — Browse open positions → click Apply
3. Submit GitHub username + optional resume PDF
4. AI pipeline runs automatically:
   - Fetches GitHub signals
   - Verifies resume vs GitHub
   - Scores against job description
   - Checks for hiring bias
5. **Recruiter** → `/recruiter` — See ranked leaderboard, open full candidate report, toggle anonymize mode

> Try with GitHub usernames: `torvalds`, `gaearon`, `sindresorhus`

---

## API Keys

| Key | Where to get |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — free tier available |
| `MONGO_URI` | [mongodb.com/atlas](https://www.mongodb.com/atlas) — free cluster |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) — optional, avoids rate limits |

---

<div align="center">

**SkillDNA** · Techkriti '26 × Eightfold AI Hackathon

*Don't hire the best resume. Hire the best developer.*

</div>
