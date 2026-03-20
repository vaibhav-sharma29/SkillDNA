import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import './Landing.css'

function FadeIn({ children, delay = 0, x = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

function DNALine() {
  return (
    <div className="dna-container">
      <svg viewBox="0 0 800 60" className="dna-svg" preserveAspectRatio="none">
        <motion.path
          d="M0,30 L100,30 L120,30 L135,8 L150,52 L165,5 L180,55 L195,30 L240,30 L800,30"
          fill="none" stroke="url(#dnaGrad)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.5 }}
        />
        <defs>
          <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

const features = [
  { icon: '🔍', title: 'GitHub Signal Extraction', desc: 'Real commits, languages, project complexity — not resume keywords. We analyze what you actually built.', color: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
  { icon: '📄', title: 'Resume vs Reality Check', desc: 'AI cross-verifies every skill claim in your resume against actual GitHub evidence. No more fake experts.', color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  { icon: '🤖', title: 'AI-Powered Scoring', desc: 'Groq LLaMA 3 matches candidate signals against job descriptions with explainable 0-100 scores.', color: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  { icon: '💡', title: 'Explainable Results', desc: 'Every score shows matched skills, missing skills, top strength, and risk flags. No black boxes.', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  { icon: '⚖️', title: 'Bias-Free Verification', desc: 'Anonymize mode removes name, photo, gender. Score stays identical — mathematically proven fairness.', color: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
  { icon: '📊', title: 'Ranked Leaderboard', desc: 'All applicants auto-ranked by verified skill score with radar charts and language distribution graphs.', color: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
]

const steps = [
  { num: '01', title: 'Post a Job', desc: 'Recruiter posts job with required skills and description. Candidates get a direct apply link.' },
  { num: '02', title: 'Candidate Applies', desc: 'Candidate submits GitHub username + resume PDF. No keyword stuffing, no fake claims.' },
  { num: '03', title: 'AI Ranks Everyone', desc: 'SkillDNA fetches real GitHub signals, verifies resume, scores with AI, checks for bias — automatically.' },
]

export default function Landing() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <div className="landing">

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-grid-bg" />
        <div className="landing-orb orb1" />
        <div className="landing-orb orb2" />
        <div className="landing-orb orb3" />

        <motion.div className="landing-hero-content" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div className="landing-tag" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            🧬 Post-Resume Era Talent Intelligence
          </motion.div>

          <motion.h1 className="landing-title" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
            Hire on Real Proof
            <br />
            <span className="landing-gradient-text">Not Polished PDFs</span>
          </motion.h1>

          <motion.p className="landing-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            SkillDNA analyzes GitHub activity, verifies resume claims with AI, and explains every hiring decision — transparently and without bias.
          </motion.p>

          <motion.div className="landing-btns" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <Link to="/recruiter" className="landing-btn-primary">🏢 I'm a Recruiter</Link>
            <Link to="/jobs" className="landing-btn-outline">👨💻 I'm a Candidate</Link>
          </motion.div>

          <DNALine />

          <motion.div className="landing-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            {[
              { value: 'AI', label: 'Powered Scoring' },
              { value: '100%', label: 'Bias Checked' },
              { value: 'Real', label: 'GitHub Signals' },
              { value: 'Live', label: 'Demo Ready' },
            ].map((s, i) => (
              <div key={i} className="landing-stat">
                <span className="landing-stat-value">{s.value}</span>
                <span className="landing-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="landing-scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          ↓
        </motion.div>
      </section>

      {/* PROBLEM + SOLUTION */}
      <section className="landing-problem-section">
        <div className="landing-problem-inner">
          <FadeIn x={-40}>
            <div className="landing-problem-card">
              <div className="landing-card-icon">⚠️</div>
              <h2>The Hiring Crisis</h2>
              <p>Generative AI has weaponised job applications. Recruiters drown in perfectly optimised, largely synthetic resumes — indistinguishable from genuine signals of competence. The average technical skill becomes obsolete in under 2.5 years.</p>
            </div>
          </FadeIn>
          <FadeIn x={40} delay={0.15}>
            <div className="landing-solution-card">
              <div className="landing-card-icon">💡</div>
              <h2>The SkillDNA Solution</h2>
              <p>We surface genuine evidence of a candidate's abilities through real-world artefacts — GitHub contributions, commit quality, project complexity — and verify every resume claim against actual code. No black boxes. No bias.</p>
              <div className="landing-solution-badges">
                {['GitHub Analysis', 'Resume Verify', 'AI Scoring', 'Bias Check', 'Ranked List'].map((b, i) => (
                  <span key={i} className="landing-badge">{b}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how-section">
        <FadeIn>
          <div className="landing-section-header">
            <h2>How It Works</h2>
            <p>Three steps from job post to verified ranked candidates</p>
          </div>
        </FadeIn>
        <div className="landing-steps">
          {steps.map((s, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div className="landing-step-card">
                <div className="landing-step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features-section">
        <FadeIn>
          <div className="landing-section-header">
            <h2>What Makes SkillDNA Different</h2>
            <p>Six powerful features working together to eliminate hiring bias and resume fraud</p>
          </div>
        </FadeIn>
        <div className="landing-features-grid">
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="landing-feature-card" style={{ background: f.color, borderColor: f.border }}>
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <FadeIn>
          <div className="landing-cta-inner">
            <h2>Ready to hire on <span className="landing-gradient-text">real proof?</span></h2>
            <p>Post a job or apply with your GitHub. AI does the rest.</p>
            <div className="landing-btns">
              <Link to="/recruiter" className="landing-btn-primary">Post a Job →</Link>
              <Link to="/jobs" className="landing-btn-outline">Browse Jobs →</Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">
            <div className="landing-logo-icon">🧬</div>
            <span>Skill<span className="landing-gradient-text">DNA</span></span>
          </div>
          <p>Built for Techkriti '26 × Eightfold AI Hackathon</p>
          <p className="landing-footer-disclaimer">AI-powered talent intelligence · GitHub signals · Bias-free hiring</p>
        </div>
      </footer>

    </div>
  )
}
