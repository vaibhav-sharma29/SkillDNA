import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function Analyze() {
  const [username, setUsername] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const fileRef = useRef()

  const handleAnalyze = async () => {
    if (!username.trim() || !jobDescription.trim()) {
      setError('GitHub username and job description are required')
      return
    }
    setError('')
    setLoading(true)

    try {
      setLoadingStep('Fetching GitHub signals...')
      const githubRes = await axios.get(`/api/github/${username.trim()}`)
      const githubSignals = githubRes.data

      let resumeVerification = null
      if (resumeFile) {
        setLoadingStep('Verifying resume claims...')
        const formData = new FormData()
        formData.append('resume', resumeFile)
        formData.append('data', JSON.stringify({ githubSignals }))
        const resumeRes = await axios.post('/api/resume/verify', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        resumeVerification = resumeRes.data
      }

      setLoadingStep('Running AI scoring...')
      const scoreRes = await axios.post('/api/analyze/score', {
        githubSignals,
        jobDescription,
        candidateMeta: { name: candidateName || username }
      })

      setLoadingStep('Running bias check...')
      const biasRes = await axios.post('/api/bias/check', {
        githubSignals,
        jobDescription,
        candidateMeta: { name: candidateName || username, gender: 'Male', university: 'IIT Delhi' }
      })

      sessionStorage.setItem(`report_${username}`, JSON.stringify({
        githubSignals,
        scoreData: scoreRes.data,
        biasData: biasRes.data,
        resumeVerification,
        jobDescription
      }))

      navigate(`/report/${username}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Check username or API keys.')
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Analyze <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Candidate</span></h1>
          <p className="text-white/50">GitHub + Resume + AI = verified talent intelligence</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">GitHub Username *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="github-username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Candidate Name <span className="text-white/30">(for bias check)</span></label>
              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Resume <span className="text-white/30">(PDF — optional but recommended)</span></label>
            <div
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${resumeFile ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 hover:border-white/30'}`}
            >
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl">📄</span>
                  <span className="text-white text-sm">{resumeFile.name}</span>
                  <button onClick={e => { e.stopPropagation(); setResumeFile(null) }} className="text-white/30 hover:text-red-400 transition-colors">✕</button>
                </div>
              ) : (
                <div className="text-white/40 text-sm">📎 Click to upload PDF resume</div>
              )}
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Job Description *</label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={7}
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
            ) : 'Analyze Candidate →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
