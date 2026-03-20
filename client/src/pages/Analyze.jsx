import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!username.trim() || !jobDescription.trim()) {
      setError('Please enter both GitHub username and job description')
      return
    }
    setError('')
    setLoading(true)
    try {
      // Step 1: Fetch GitHub signals
      const githubRes = await axios.get(`/api/github/${username.trim()}`)
      const githubSignals = githubRes.data

      // Step 2: AI Score
      const scoreRes = await axios.post('/api/analyze/score', {
        githubSignals,
        jobDescription,
        candidateMeta: { name: candidateName || username }
      })

      // Step 3: Bias Check
      const biasRes = await axios.post('/api/bias/check', {
        githubSignals,
        jobDescription,
        candidateMeta: { name: candidateName || username, gender: 'Male', university: 'IIT Delhi' }
      })

      // Store in sessionStorage and navigate
      sessionStorage.setItem(`report_${username}`, JSON.stringify({
        githubSignals,
        scoreData: scoreRes.data,
        biasData: biasRes.data,
        jobDescription
      }))

      navigate(`/report/${username}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Check username or API keys.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2">Analyze Candidate</h1>
        <p className="text-white/50 mb-10">Enter GitHub username + job description to get AI-powered talent intelligence</p>

        <div className="space-y-6">
          {/* GitHub Username */}
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">GitHub Username *</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Candidate Name (optional - for bias check) */}
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">
              Candidate Name <span className="text-white/30">(optional — used for bias check)</span>
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Job Description *</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing GitHub + Running AI...
              </span>
            ) : 'Analyze Candidate →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
