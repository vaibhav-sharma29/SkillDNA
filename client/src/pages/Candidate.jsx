import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

export default function Candidate() {
  const [username, setUsername] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [scoreData, setScoreData] = useState(null)

  const handleAnalyze = async () => {
    if (!username.trim()) { setError('Enter your GitHub username'); return }
    setError('')
    setLoading(true)
    setData(null)
    setScoreData(null)

    try {
      const githubRes = await axios.get(`/api/github/${username.trim()}`)
      setData(githubRes.data)

      if (jobDescription.trim()) {
        const scoreRes = await axios.post('/api/analyze/score', {
          githubSignals: githubRes.data,
          jobDescription,
          candidateMeta: { name: githubRes.data.profile.name || username }
        })
        setScoreData(scoreRes.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'GitHub user not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white mb-2">Your SkillDNA</h1>
        <p className="text-white/50 mb-10">See what your GitHub says about you — no resume needed</p>

        <div className="space-y-5">
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Your GitHub Username *</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">
              Job Description <span className="text-white/30">(optional — get match score for a role)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste a job description to see how well you match..."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing your GitHub...
              </span>
            ) : 'Reveal My SkillDNA →'}
          </motion.button>
        </div>

        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-5">

              <div className="flex items-center gap-4">
                <img src={data.profile.avatarUrl} alt={data.profile.username} className="w-16 h-16 rounded-full border-2 border-violet-500" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{data.profile.name || data.profile.username}</h2>
                  <a href={`https://github.com/${data.profile.username}`} target="_blank" rel="noreferrer"
                    className="text-violet-400 text-sm hover:underline">@{data.profile.username}</a>
                  {data.profile.bio && <p className="text-white/40 text-sm mt-1">{data.profile.bio}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Public Repos', value: data.profile.publicRepos },
                  { label: 'Total Stars', value: data.signals.totalStars },
                  { label: 'Complexity', value: data.signals.complexityLevel },
                  { label: 'Days Since Active', value: data.signals.daysSinceLastActive ?? 'N/A' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-violet-400 font-bold text-2xl">{stat.value}</div>
                    <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3">Top Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {data.signals.topLanguages.map((l, i) => (
                    <span key={i} className="bg-violet-500/10 text-violet-300 text-sm px-3 py-1 rounded-full border border-violet-500/20">
                      {l.lang} · {l.count} repos
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3">Commit Activity</h3>
                <div className="space-y-3">
                  {data.signals.commitDetails.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">{c.repo}</span>
                      <span className="text-violet-400 text-sm font-medium">{c.commits} commits</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${data.signals.activelyContributing ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-white/50 text-sm">
                    {data.signals.activelyContributing ? 'Actively contributing in last 30 days' : 'Not active in last 30 days'}
                  </span>
                </div>
              </div>

              {scoreData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-violet-500/5 border border-violet-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">Job Match Score</h3>
                    <span className="text-4xl font-bold text-violet-400">{scoreData.score}<span className="text-white/30 text-xl">/100</span></span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scoreData.score}%` }}
                      transition={{ duration: 1 }}
                      className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                    />
                  </div>
                  <p className="text-white/60 text-sm mb-4">{scoreData.reasoning}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-green-400 text-sm font-medium mb-2">✅ You have</div>
                      <div className="flex flex-wrap gap-1">
                        {scoreData.matchedSkills?.map((s, i) => (
                          <span key={i} className="bg-green-500/10 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-red-400 text-sm font-medium mb-2">❌ You need</div>
                      <div className="flex flex-wrap gap-1">
                        {scoreData.missingSkills?.map((s, i) => (
                          <span key={i} className="bg-red-500/10 text-red-300 text-xs px-2 py-1 rounded-full border border-red-500/20">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
