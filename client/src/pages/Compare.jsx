import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const verdictColor = {
  'Strong Match': 'text-green-400',
  'Good Match': 'text-blue-400',
  'Partial Match': 'text-yellow-400',
  'Weak Match': 'text-red-400',
}

export default function Compare() {
  const [usernames, setUsernames] = useState(['', ''])
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const addCandidate = () => setUsernames([...usernames, ''])
  const removeCandidate = (i) => setUsernames(usernames.filter((_, idx) => idx !== i))
  const updateUsername = (i, val) => {
    const updated = [...usernames]
    updated[i] = val
    setUsernames(updated)
  }

  const handleCompare = async () => {
    const validUsernames = usernames.filter(u => u.trim())
    if (validUsernames.length < 2 || !jobDescription.trim()) {
      setError('Add at least 2 GitHub usernames and a job description')
      return
    }
    setError('')
    setLoading(true)
    setResults(null)

    try {
      // Fetch all GitHub signals in parallel
      const githubResults = await Promise.all(
        validUsernames.map(u => axios.get(`/api/github/${u.trim()}`))
      )

      const candidates = githubResults.map(r => ({
        githubSignals: r.data,
        candidateMeta: { name: r.data.profile.name || r.data.profile.username }
      }))

      const rankRes = await axios.post('/api/analyze/rank', { candidates, jobDescription })
      setResults(rankRes.data.ranked)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2">Compare Candidates</h1>
        <p className="text-white/50 mb-10">Add multiple GitHub usernames and get a ranked leaderboard</p>

        <div className="space-y-6">
          {/* Usernames */}
          <div>
            <label className="text-white/70 text-sm font-medium mb-3 block">GitHub Usernames</label>
            <div className="space-y-3">
              {usernames.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <input
                    type="text"
                    value={u}
                    onChange={e => updateUsername(i, e.target.value)}
                    placeholder={`Candidate ${i + 1} username`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  {usernames.length > 2 && (
                    <button onClick={() => removeCandidate(i)}
                      className="px-3 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addCandidate}
              className="mt-3 text-violet-400 text-sm hover:text-violet-300 transition-colors">
              + Add another candidate
            </button>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Job Description *</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleCompare}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Ranking Candidates...
              </span>
            ) : 'Rank Candidates →'}
          </motion.button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">🏆 Ranked Leaderboard</h2>
              {results.map((r, i) => (
                <motion.div
                  key={r.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white/5 border rounded-2xl p-5 ${i === 0 ? 'border-violet-500/50' : 'border-white/10'}`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`text-2xl font-bold w-10 text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-white/60' : i === 2 ? 'text-orange-400' : 'text-white/30'}`}>
                      #{r.rank}
                    </div>
                    {r.avatarUrl && <img src={r.avatarUrl} alt={r.username} className="w-10 h-10 rounded-full" />}
                    <div className="flex-1">
                      <div className="text-white font-semibold">@{r.username}</div>
                      <div className={`text-sm ${verdictColor[r.verdict] || 'text-white/50'}`}>{r.verdict}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-violet-400">{r.score}</div>
                      <div className="text-white/30 text-xs">/ 100</div>
                    </div>
                  </div>

                  <p className="text-white/50 text-sm mb-3">{r.reasoning}</p>

                  <div className="flex flex-wrap gap-2">
                    {r.matchedSkills?.slice(0, 4).map((s, j) => (
                      <span key={j} className="bg-green-500/10 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/20">✅ {s}</span>
                    ))}
                    {r.missingSkills?.slice(0, 3).map((s, j) => (
                      <span key={j} className="bg-red-500/10 text-red-300 text-xs px-2 py-1 rounded-full border border-red-500/20">❌ {s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
