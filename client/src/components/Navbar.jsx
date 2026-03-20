import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { pathname } = useLocation()
  const isRecruiter = pathname.startsWith('/recruiter')
  const isCandidate = pathname.startsWith('/jobs') || pathname.startsWith('/candidate')

  return (
    <nav className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3">
        <motion.div whileHover={{ rotate: 10 }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-black text-sm glow-purple">
          S
        </motion.div>
        <span className="font-black text-white text-xl tracking-tight">
          Skill<span className="gradient-text">DNA</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/jobs">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isCandidate ? 'bg-violet-600 text-white glow-purple' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
            👨💻 Candidate
          </motion.div>
        </Link>
        <Link to="/recruiter">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isRecruiter ? 'bg-violet-600 text-white glow-purple' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
            🏢 Recruiter
          </motion.div>
        </Link>
      </div>
    </nav>
  )
}
