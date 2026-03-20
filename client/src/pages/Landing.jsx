import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🔍',
    title: 'GitHub Signal Extraction',
    desc: 'Real commits, languages, project complexity — not just resume keywords'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Scoring',
    desc: 'Groq AI matches candidate signals against job description with 0-100 score'
  },
  {
    icon: '💡',
    title: 'Explainable Results',
    desc: 'Every score comes with matched skills, missing skills, and clear reasoning'
  },
  {
    icon: '⚖️',
    title: 'Bias-Free Check',
    desc: 'Remove name, gender, university — score stays the same. Proven fairness.'
  },
  {
    icon: '📊',
    title: 'Candidate Ranking',
    desc: 'Compare multiple candidates side by side with ranked leaderboard'
  },
  {
    icon: '📈',
    title: 'Commit Pattern Analysis',
    desc: 'How active, how consistent, how complex — real developer signals'
  }
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 text-violet-400 text-sm mb-6">
            🧬 Post-Resume Era Talent Intelligence
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Hire on <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-600">Real Proof</span>
            <br />Not Polished PDFs
          </h1>

          <p className="text-white/60 text-xl mb-10 max-w-2xl mx-auto">
            SkillDNA analyzes GitHub activity, scores candidates against job descriptions using AI,
            and explains every decision — transparently and without bias.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/analyze">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
              >
                Analyze a Candidate →
              </motion.button>
            </Link>
            <Link to="/compare">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/20 hover:border-violet-500 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
              >
                Compare Candidates
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">The Hiring Crisis is Real</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left mt-6">
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

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          How SkillDNA <span className="text-violet-400">Solves It</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to see real talent?</h2>
          <p className="text-white/50 mb-8">Paste a GitHub username and job description. Get results in seconds.</p>
          <Link to="/analyze">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg"
            >
              Start Analyzing →
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
