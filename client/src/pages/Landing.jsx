import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  { icon: '🔍', title: 'GitHub Signal Extraction', desc: 'Real commits, languages, project complexity — not resume keywords', color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/20' },
  { icon: '📄', title: 'Resume vs Reality Check', desc: 'AI verifies if resume claims match actual GitHub evidence', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/20' },
  { icon: '🤖', title: 'AI-Powered Scoring', desc: 'Groq LLaMA matches candidate signals against job description', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/20' },
  { icon: '💡', title: 'Explainable Results', desc: 'Every score comes with matched skills, missing skills, and reasoning', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/20' },
  { icon: '⚖️', title: 'Bias-Free Check', desc: 'Remove name, gender, university — score stays the same. Proven.', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/20' },
  { icon: '📊', title: 'Ranked Leaderboard', desc: 'All applicants auto-ranked by verified skill score with graphs', color: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/20' },
]

const stats = [
  { value: 'AI', label: 'Powered Scoring' },
  { value: '100%', label: 'Bias Checked' },
  { value: 'Real', label: 'GitHub Signals' },
  { value: 'Live', label: 'Demo Ready' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-grid">
      <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed" />

      <section className="relative px-6 pt-24 pb-20 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-purple rounded-full px-5 py-2.5 text-violet-300 text-sm mb-8 font-medium">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Post-Resume Era Talent Intelligence
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Hire on{' '}
            <span className="gradient-text">Real Proof</span>
            <br />
            <span className="text-white/80">Not Polished PDFs</span>
          </h1>

          <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            SkillDNA analyzes GitHub activity, verifies resume claims with AI, and explains every hiring decision — transparently and without bias.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link to="/recruiter">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
                🏢 I'm a Recruiter
              </motion.button>
            </Link>
            <Link to="/jobs">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="glass border border-white/10 hover:border-violet-500/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
                👨‍💻 I'm a Candidate
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass border border-red-500/15 rounded-3xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">The Hiring Crisis is Real</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '🤖', title: 'AI-Spam Flood', color: 'text-red-400', desc: 'Generative AI has weaponised applications. Recruiters drown in perfectly optimised, largely synthetic resumes indistinguishable from real ones.' },
              { icon: '⏳', title: 'Skill Half-Life Collapse', color: 'text-orange-400', desc: 'Average technical skill becomes obsolete in under 2.5 years. Static credentials are fundamentally backward-looking.' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <div className={`${item.color} font-semibold mb-2 text-lg`}>{item.icon} {item.title}</div>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3">How SkillDNA <span className="gradient-text">Solves It</span></h2>
          <p className="text-white/40">Six powerful features working together</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`glass card-hover rounded-2xl p-6 border ${f.border}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to see <span className="gradient-text">real talent?</span></h2>
          <p className="text-white/40 mb-8">Post a job or apply with your GitHub. Results in seconds.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/recruiter">
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg">
                Post a Job →
              </motion.button>
            </Link>
            <Link to="/jobs">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="glass border border-white/10 hover:border-violet-500/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all">
                Browse Jobs →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
