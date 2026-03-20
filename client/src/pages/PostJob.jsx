import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', description: '', skills: '', experience: '', remote: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
    <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 text-violet-300 text-xs font-medium mb-4">
            🏢 Recruiter Portal
          </div>
          <h1 className="text-5xl font-black text-white mb-3">Post a <span className="gradient-text">Job</span></h1>
          <p className="text-white/40">Candidates apply with GitHub + resume — AI ranks them automatically</p>
        </div>

        <div className="glass rounded-3xl p-7 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Job Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Full Stack Developer"
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Company *</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Eightfold AI"
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Job Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>

          <div>
            <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Required Skills <span className="text-white/25 normal-case">(comma separated)</span></label>
            <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB, Docker"
              className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 block">Experience</label>
              <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-[#050508] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all">
                <option value="">Select experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <button onClick={() => setForm({ ...form, remote: !form.remote })}
                className={`w-12 h-6 rounded-full transition-all relative ${form.remote ? 'bg-violet-600' : 'bg-white/10'}`}>
                <motion.div animate={{ x: form.remote ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5" />
              </button>
              <span className="text-white/60 text-sm">Remote position</span>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

          <motion.button whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg transition-all">
            {loading ? 'Posting...' : 'Post Job →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
