import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import AIThinkingPanel from '../components/AIThinkingPanel'
import './pages.css'

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

  if (!job) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
      Loading...
    </div>
  )

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="card-lg" style={{ textAlign: 'center', maxWidth: '440px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</motion.div>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          Application Submitted!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          Your GitHub has been analyzed and scored. The recruiter will see your verified profile.
        </p>
        <motion.button whileHover={{ scale: 1.04 }} onClick={() => navigate('/jobs')}
          className="btn-primary" style={{ margin: '0 auto' }}>
          Browse More Jobs
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <div className="page-wrapper" style={{ maxWidth: '800px' }}>
      <AnimatePresence>
        {loading && <AIThinkingPanel active={loading} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Job info banner */}
        <div style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: '20px', padding: '28px 32px', marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(124,58,237,0.7)', marginBottom: '10px' }}>
            Applying for
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.3px' }}>{job.title}</h2>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: job.skills?.length ? '16px' : 0 }}>
            {job.company}{job.experience && ` · ${job.experience}`}
          </div>
          {job.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {job.skills.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="card-lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="field-label">GitHub Username *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>@</span>
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="your-username"
                    className="field-input" style={{ paddingLeft: '32px' }} />
                </div>
              </div>
              <div>
                <label className="field-label">Your Name</label>
                <input value={candidateName} onChange={e => setCandidateName(e.target.value)}
                  placeholder="Full name"
                  className="field-input" />
              </div>
            </div>

            <div>
              <label className="field-label">
                Resume PDF
                <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '8px' }}>optional — AI verifies claims</span>
              </label>
              <div onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${resumeFile ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '14px',
                  padding: '28px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: resumeFile ? 'rgba(124,58,237,0.05)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}>
                <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setResumeFile(e.target.files[0])} />
                {resumeFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <span style={{ color: '#fff', fontSize: '14px' }}>{resumeFile.name}</span>
                    <button onClick={e => { e.stopPropagation(); setResumeFile(null) }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}>✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>📎</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '4px' }}>Click to upload PDF</div>
                    <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '12px' }}>AI will verify your claims vs GitHub</div>
                  </div>
                )}
              </div>
            </div>

            {error && <div className="banner-error">{error}</div>}

            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 36px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.98 }}
              onClick={handleApply} disabled={loading}
              className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '17px', fontSize: '16px', borderRadius: '14px', marginTop: '8px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {loadingStep}
                </span>
              ) : 'Submit Application →'}
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
