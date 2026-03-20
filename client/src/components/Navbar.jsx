import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/analyze', label: 'Analyze' },
    { to: '/compare', label: 'Compare' },
  ]

  return (
    <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm">S</div>
        <span className="font-bold text-white text-lg">Skill<span className="text-violet-400">DNA</span></span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(link => (
          <Link key={link.to} to={link.to}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-violet-600 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
