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
          <h1 className="text-4xl font-bold text-white mb-2">Post a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Job</span></h1>
          <p className="text-white/50">Candidates will apply with GitHub + resume — AI ranks them automatically</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Job Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Senior Full Stack Developer"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors" />
            </div>
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Company *</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Eightfold AI"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Job Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium mb-2 block">Required Skills <span className="text-white/30">(comma separated)</span></label>
            <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB, Docker"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Experience Required</label>
              <select value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors">
                <option value="">Select experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setForm({ ...form, remote: !form.remote })}
                className={`w-12 h-6 rounded-full transition-colors relative ${form.remote ? 'bg-violet-600' : 'bg-white/20'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form.remote ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-white/70 text-sm">Remote position</span>
            </div>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all">
            {loading ? 'Posting...' : 'Post Job →'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
