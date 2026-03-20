import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import './pages.css'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/jobs').then(r => { setJobs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="page-wrapper">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        <div className="page-header">
          <div className="page-tag">👨‍💻 Candidate Portal</div>
          <h1 className="page-title">Open <span className="gradient-text">Positions</span></h1>
          <p className="page-subtitle">Apply with GitHub + resume — AI verifies your skills automatically, no keyword stuffing needed.</p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: '64px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '15px' }}>
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ padding: '80px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px', marginBottom: '8px' }}>No open positions yet</div>
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Check back soon</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.map((job, i) => (
              <motion.div key={job._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.3px' }}>
                      {job.title}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <span className="gradient-text" style={{ fontWeight: 700, fontSize: '14px' }}>{job.company}</span>
                      {job.experience && (
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>· {job.experience}</span>
                      )}
                      {job.remote && (
                        <span style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '12px', padding: '4px 12px', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>
                          🌍 Remote
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', lineHeight: 1.75, marginBottom: '18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>
                    {job.skills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {job.skills.map((s, j) => (
                          <span key={j} className="skill-tag">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/jobs/${job._id}/apply`} style={{ flexShrink: 0 }}>
                    <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 28px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.95 }}
                      className="btn-primary">
                      Apply Now →
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
