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
          <h1 className="text-4xl font-bold text-white mb-2">Open <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Positions</span></h1>
          <p className="text-white/50">Apply with your GitHub + resume — no keyword-stuffed resume needed</p>
        </div>

        {loading ? (
          <div className="text-white/30">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-white/40">No open positions yet</div>
            <div className="text-white/30 text-sm mt-1">Check back soon</div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 hover:border-violet-500/40 rounded-2xl p-6 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-xl mb-1">{job.title}</h2>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-violet-400 font-medium">{job.company}</span>
                      {job.experience && <span className="text-white/40 text-sm">· {job.experience}</span>}
                      {job.remote && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">🌍 Remote</span>}
                    </div>
                    <p className="text-white/50 text-sm line-clamp-2 mb-4">{job.description}</p>
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((s, j) => (
                          <span key={j} className="bg-violet-500/10 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/20">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to={`/jobs/${job._id}/apply`}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
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
