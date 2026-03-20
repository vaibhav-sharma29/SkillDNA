import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  { icon: '🔍', title: 'GitHub Signal Extraction', desc: 'Real commits, languages, project complexity — not resume keywords' },
  { icon: '📄', title: 'Resume vs Reality Check', desc: 'AI verifies if resume claims match actual GitHub evidence' },
  { icon: '🤖', title: 'AI-Powered Scoring', desc: 'Groq AI matches candidate signals against job description' },
  { icon: '💡', title: 'Explainable Results', desc: 'Every score comes with matched skills, missing skills, and reasoning' },
  { icon: '⚖️', title: 'Bias-Free Check', desc: 'Remove name, gender, university — score stays the same' },
  { icon: '📊', title: 'Ranked Leaderboard', desc: 'Compare all applicants ranked by verified skill score' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 text-violet-400 text-sm mb-6">
            🧬 Post-Resume Era Talent Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Hire on <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">Real Proof</span>
            <br />Not Polished PDFs
          </h1>
          <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            SkillDNA analyzes GitHub activity, verifies resume claims, scores candidates with AI — transparently and without bias.
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <Link to="/recruiter">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-left cursor-pointer group">
                <div className="text-3xl mb-3">🏢</div>
                <div className="text-white font-bold text-lg mb-1">I'm a Recruiter</div>
                <div className="text-white/60 text-sm">Post jobs, review verified candidates, rank by real skills</div>
                <div className="text-violet-300 text-sm mt-3 group-hover:translate-x-1 transition-transform">Get started →</div>
              </motion.div>
            </Link>
            <Link to="/jobs">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-white/5 border border-white/10 hover:border-violet-500/50 rounded-2xl p-6 text-left cursor-pointer group transition-colors">
                <div className="text-3xl mb-3">👨‍💻</div>
                <div className="text-white font-bold text-lg mb-1">I'm a Candidate</div>
                <div className="text-white/60 text-sm">Browse jobs, apply with GitHub + resume, get verified</div>
                <div className="text-violet-400 text-sm mt-3 group-hover:translate-x-1 transition-transform">Browse jobs →</div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">The Hiring Crisis is Real</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-red-400 font-semibold mb-2">🤖 AI-Spam Flood</div>
              <p className="text-white/60 text-sm">Generative AI has weaponised applications. Recruiters drown in perfectly optimised, largely synthetic resumes.</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-orange-400 font-semibold mb-2">⏳ Skill Half-Life Collapse</div>
              <p className="text-white/60 text-sm">Average technical skill becomes obsolete in under 2.5 years. Static credentials are fundamentally backward-looking.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How SkillDNA <span className="text-violet-400">Solves It</span></h2>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
