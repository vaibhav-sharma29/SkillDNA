import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const TrustBadge = ({ level }) => {
  const styles = {
    'High Trust': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Medium Trust': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Low Trust': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Suspicious': 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  const icons = { 'High Trust': '✅', 'Medium Trust': '🔵', 'Low Trust': '⚠️', 'Suspicious': '🚨' }
  return (
    <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${styles[level] || styles['Medium Trust']}`}>
      {icons[level]} {level}
    </span>
  )
}

export default function Candidate() {
  const [username, setUsername] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState('')
  const [githubData, setGithubData] = useState(null)
  const [scoreData, setScoreData] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const fileRef = useRef()

  const handleAnalyze = async () => {
    if (!username.trim()) { setError('Enter your GitHub username'); return }
    setError('')
    setLoading(true)
    setGithubData(null)
    setScoreData(null)
    setResumeData(null)

    try {
      setLoadingStep('Fetching GitHub profile...')
      const githubRes = await axios.get(`/api/github/${username.trim()}`)
      setGithubData(githubRes.data)

      if (resumeFile) {
        setLoadingStep('Analyzing resume vs GitHub...')
        const formData = new FormData()
        formData.append('resume', resumeFile)
        formData.append('data', JSON.stringify({ githubSignals: githubRes.data }))
        const resumeRes = await axios.post('/api/resume/verify', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setResumeData(resumeRes.data)
      }

      if (jobDescription.trim()) {
        setLoadingStep('Scoring against job description...')
        const scoreRes = await axios.post('/api/analyze/score', {
          githubSignals: githubRes.data,
          jobDescription,
          candidateMeta: { name: githubRes.data.profile.name || username }
        })
        setScoreData(scoreRes.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">SkillDNA</span></h1>
          <p className="text-white/50">Upload your resume + GitHub — we verify if your claims match reality</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">GitHub Username *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your-github-username"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">
              Resume <span className="text-white/30">(PDF — we verify your claims against GitHub)</span>
            </label>
            <div
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${resumeFile ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 hover:border-white/30'}`}
            >
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">{resumeFile.name}</div>
                    <div className="text-white/40 text-xs">{(resumeFile.size / 1024).toFixed(0)} KB</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setResumeFile(null) }} className="ml-auto text-white/30 hover:text-red-400 transition-colors">✕</button>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">📎</div>
                  <div className="text-white/50 text-sm">Click to upload PDF resume</div>
                  <div className="text-white/30 text-xs mt-1">Max 5MB</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">
              Job Description <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste a job description to get your match score..."
              rows={4}
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
            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {loadingStep}
              </span>
            ) : 'Reveal My SkillDNA →'}
          </motion.button>
        </div>

        <AnimatePresence>
          {githubData && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-5">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
                <img src={githubData.profile.avatarUrl} alt={githubData.profile.username} className="w-16 h-16 rounded-full border-2 border-violet-500" />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{githubData.profile.name || githubData.profile.username}</h2>
                  <a href={`https://github.com/${githubData.profile.username}`} target="_blank" rel="noreferrer" className="text-violet-400 text-sm hover:underline">@{githubData.profile.username}</a>
                  {githubData.profile.bio && <p className="text-white/40 text-sm mt-1">{githubData.profile.bio}</p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${githubData.signals.activelyContributing ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {githubData.signals.activelyContributing ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Public Repos', value: githubData.profile.publicRepos, icon: '📁' },
                  { label: 'Total Stars', value: githubData.signals.totalStars, icon: '⭐' },
                  { label: 'Complexity', value: githubData.signals.complexityLevel, icon: '🧠' },
                  { label: 'Commits Sampled', value: githubData.signals.totalCommitsSampled, icon: '💾' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-violet-400 font-bold text-xl">{stat.value}</div>
                    <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3">🛠 Top Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {githubData.signals.topLanguages.map((l, i) => (
                    <span key={i} className="bg-violet-500/10 text-violet-300 text-sm px-3 py-1.5 rounded-full border border-violet-500/20 font-medium">
                      {l.lang} <span className="text-violet-500">·</span> {l.count} repos
                    </span>
                  ))}
                </div>
              </div>

              {resumeData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold text-lg">🔍 Resume vs GitHub Verification</h3>
                    <TrustBadge level={resumeData.verification.trustLevel} />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Verification Score</span>
                      <span className="text-white font-bold">{resumeData.verification.verificationScore}/100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resumeData.verification.verificationScore}%` }}
                        transition={{ duration: 1 }}
                        className={`h-2 rounded-full ${resumeData.verification.verificationScore > 70 ? 'bg-green-500' : resumeData.verification.verificationScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-5 bg-white/5 rounded-xl p-3">{resumeData.verification.verdict}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                      <div className="text-green-400 text-sm font-semibold mb-2">✅ Verified</div>
                      <div className="space-y-1">
                        {resumeData.verification.verifiedSkills?.map((s, i) => (
                          <div key={i} className="text-green-300 text-xs bg-green-500/10 px-2 py-1 rounded-lg">{s}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                      <div className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Unverified</div>
                      <div className="space-y-1">
                        {resumeData.verification.unverifiedSkills?.map((s, i) => (
                          <div key={i} className="text-yellow-300 text-xs bg-yellow-500/10 px-2 py-1 rounded-lg">{s}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                      <div className="text-red-400 text-sm font-semibold mb-2">❌ Contradictions</div>
                      <div className="space-y-1">
                        {resumeData.verification.contradictions?.length > 0
                          ? resumeData.verification.contradictions.map((s, i) => (
                            <div key={i} className="text-red-300 text-xs bg-red-500/10 px-2 py-1 rounded-lg">{s}</div>
                          ))
                          : <div className="text-white/30 text-xs">None found</div>
                        }
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {scoreData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-violet-500/5 border border-violet-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">🎯 Job Match Score</h3>
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
