import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import AIThinkingPanel from '../components/AIThinkingPanel'

export default function Apply() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [username, setUsername] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    axios.get(`/api/jobs/${jobId}`).then(r => setJob(r.data)).catch(() => navigate('/jobs'))
  }, [jobId])

  const handleApply = async () => {
    if (!username.trim()) { setError('GitHub username is required'); return }
    setError('')
    setLoading(true)
    try {
      setLoadingStep('Fetching GitHub profile...')
      const githubRes = await axios.get(`/api/github/${username.trim()}`)
      const githubSignals = githubRes.data

      let resumeVerification = null
      if (resumeFile) {
        setLoadingStep('Verifying resume vs GitHub...')
        const formData = new FormData()
        formData.append('resume', resumeFile)
        formData.append('data', JSON.stringify({ githubSignals }))
        try {
          const resumeRes = await axios.post('/api/resume/verify', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          resumeVerification = resumeRes.data
        } catch { }
      }

      setLoadingStep('Running AI scoring...')
      const scoreRes = await axios.post('/api/analyze/score', {
        githubSignals, jobDescription: job.description,
        candidateMeta: { name: candidateName || username }
      })

      setLoadingStep('Running bias check...')
      const biasRes = await axios.post('/api/bias/check', {
        githubSignals, jobDescription: job.description,
        candidateMeta: { name: candidateName || username, gender: 'Not specified', university: 'Not specified' }
      })

      setLoadingStep('Submitting application...')
      await axios.post(`/api/jobs/${jobId}/apply`, {
        username: username.trim(),
        candidateName: candidateName || githubSignals.profile.name || username,
        avatarUrl: githubSignals.profile.avatarUrl,
        githubSignals, scoreData: scoreRes.data,
        resumeVerification, biasData: biasRes.data
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
      setLoadingStep('')
    }
  }

  if (!job) return <div className="min-h-screen flex items-center justify-center text-white/25">Loading...</div>

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass border border-emerald-500/20 rounded-3xl p-10 text-center max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-6xl mb-5">🎉</motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
        <p className="text-white/40 text-sm mb-6">Your GitHub has been analyzed and scored. Recruiter will see your verified profile.</p>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/jobs')}
          className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold">
          Browse More Jobs
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <AnimatePresence>
        {loading && <AIThinkingPanel active={loading} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-purple rounded-2xl p-5 mb-8">
          <div className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">Applying for</div>
          <h2 className="text-white font-bold text-xl">{job.title}</h2>
          <div className="text-white/40 text-sm">{job.company}{job.experience && ` · ${job.experience}`}</div>
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.map((s, i) => (
                <span key={i} className="bg-violet-500/10 text-violet-300 text-xs px-2.5 py-0.5 rounded-full border border-violet-500/20">{s}</span>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">GitHub Username *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm">@</span>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="your-username"
                  className="w-full glass border border-white/8 rounded-xl pl-8 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
              </div>
            </div>
            <div>
              <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">Your Name</label>
              <input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="Full name"
                className="w-full glass border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all text-sm" />
            </div>
          </div>

          <div>
            <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">Resume PDF <span className="text-white/20 normal-case font-normal">(optional — AI verifies claims)</span></label>
            <div onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${resumeFile ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/8 hover:border-white/20'}`}>
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setResumeFile(e.target.files[0])} />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-3">
                  <span>📄</span>
                  <span className="text-white text-sm">{resumeFile.name}</span>
                  <button onClick={e => { e.stopPropagation(); setResumeFile(null) }} className="text-white/25 hover:text-red-400 transition-colors ml-2">✕</button>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-1">📎</div>
                  <div className="text-white/35 text-sm">Click to upload PDF</div>
                  <div className="text-white/20 text-xs mt-1">AI will verify your claims vs GitHub</div>
                </div>
              )}
            </div>
          </div>

          {error && <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

          <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.98 }}
            onClick={handleApply} disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-base transition-all">
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {loadingStep}
              </span>
            ) : 'Submit Application →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
