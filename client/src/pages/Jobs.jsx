import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/jobs').then(r => { setJobs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 text-violet-300 text-xs font-medium mb-4">
            👨💻 Candidate Portal
          </div>
          <h1 className="text-5xl font-black text-white mb-3">Open <span className="gradient-text">Positions</span></h1>
          <p className="text-white/40 text-lg">Apply with GitHub + resume — no keyword-stuffed resume needed</p>
        </div>

        {loading ? (
          <div className="glass rounded-3xl p-12 text-center text-white/30">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <div className="text-white/40 text-lg">No open positions yet</div>
            <div className="text-white/25 text-sm mt-2">Check back soon</div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="glass card-hover rounded-2xl p-6 border border-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-xl mb-2">{job.title}</h2>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="gradient-text font-semibold">{job.company}</span>
                      {job.experience && <span className="text-white/30 text-sm">· {job.experience}</span>}
                      {job.remote && (
                        <span className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">🌍 Remote</span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm line-clamp-2 mb-4 leading-relaxed">{job.description}</p>
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((s, j) => (
                          <span key={j} className="bg-violet-500/10 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/20">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/jobs/${job._id}/apply`} className="shrink-0">
                    <motion.button whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">
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
