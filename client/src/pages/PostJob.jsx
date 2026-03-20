import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import './pages.css'

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', description: '', skills: '', experience: '', remote: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.description) { setError('Title, company and description are required'); return }
    setLoading(true)
    try {
      await axios.post('/api/jobs', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) })
      navigate('/recruiter')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post job')
    } finally { setLoading(false) }
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '860px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        <div className="page-header">
          <div className="page-tag">🏢 Recruiter Portal</div>
          <h1 className="page-title">Post a <span className="gradient-text">Job</span></h1>
          <p className="page-subtitle">Candidates apply with GitHub + resume — AI ranks them automatically by verified skills.</p>
        </div>

        <div className="card-lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label className="field-label">Job Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="field-input" />
              </div>
              <div>
                <label className="field-label">Company *</label>
                <input value={form.company} onChange={e => set('company', e.target.value)}
                  placeholder="e.g. Eightfold AI"
                  className="field-input" />
              </div>
            </div>

            <div>
              <label className="field-label">Job Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={6} className="field-textarea" />
            </div>

            <div>
              <label className="field-label">
                Required Skills
                <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: '8px' }}>comma separated</span>
              </label>
              <input value={form.skills} onChange={e => set('skills', e.target.value)}
                placeholder="React, Node.js, MongoDB, Docker"
                className="field-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'end' }}>
              <div>
                <label className="field-label">Experience Level</label>
                <select value={form.experience} onChange={e => set('experience', e.target.value)} className="field-select">
                  <option value="">Select experience</option>
                  <option value="0-1 years">0–1 years</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '2px' }}>
                <button onClick={() => set('remote', !form.remote)}
                  style={{ width: '48px', height: '26px', borderRadius: '50px', border: 'none', cursor: 'pointer', position: 'relative', background: form.remote ? '#7c3aed' : 'rgba(255,255,255,0.1)', transition: 'background 0.25s ease', flexShrink: 0 }}>
                  <motion.div animate={{ x: form.remote ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px' }} />
                </button>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', fontWeight: 500 }}>Remote position</span>
              </div>
            </div>

            {error && <div className="banner-error">{error}</div>}

            <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 36px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} disabled={loading}
              className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '17px', fontSize: '16px', borderRadius: '14px', marginTop: '8px' }}>
              {loading ? 'Posting...' : 'Post Job →'}
            </motion.button>

          </div>
        </div>
      </motion.div>
    </div>
  )
}
