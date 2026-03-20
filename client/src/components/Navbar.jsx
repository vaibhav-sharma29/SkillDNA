import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/jobs', label: 'Jobs', match: '/jobs' },
  { to: '/recruiter', label: 'Recruiter', match: '/recruiter' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  const isActive = (link) => {
    if (link.exact) return pathname === '/'
    return pathname.startsWith(link.match)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <motion.div whileHover={{ rotate: 12 }} className="navbar-logo-icon">
            🧬
          </motion.div>
          <span className="navbar-logo-text">
            Skill<span className="navbar-logo-accent">DNA</span>
          </span>
        </Link>

        {/* Links */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`navbar-link ${isActive(link) ? 'navbar-link-active' : ''}`}>
              {link.label}
              {isActive(link) && (
                <motion.div layoutId="navbar-indicator" className="navbar-link-dot" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="navbar-cta">
          <Link to="/jobs" className="navbar-btn-outline">Browse Jobs</Link>
          <Link to="/recruiter/post-job">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="navbar-btn-primary">
              Post a Job
            </motion.div>
          </Link>
        </div>
      </div>
    </nav>
  )
}
