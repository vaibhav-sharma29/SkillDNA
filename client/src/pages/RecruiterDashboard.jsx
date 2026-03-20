import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './pages.css'

const COLORS = ['#7c3aed', '#8b5cf6', '#6d28d9', '#a78bfa', '#5b21b6', '#c4b5fd']

const verdictStyle = {
  'Strong Match': { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  'Good Match': { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  'Partial Match': { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  'Weak Match': { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="glass rounded-xl px-3 py-2 text-xs text-white border border-violet-500/20">
      <div className="font-semibold">{label}</div>
      <div className="text-violet-400">{payload[0].value} repos</div>
    </div>
  )
  return null
}

function ScoreRing({ score }) {
  const r = 36, c = 2 * Math.PI * r
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <motion.circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 1.5, ease: 'easeOut' }} />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-black text-white">{score}</div>
        <div className="text-white/30 text-xs">/100</div>
      </div>
    </div>
  )
}

function CandidateModal({ app, onClose }) {
  const [anonymized, setAnonymized] = useState(false)
  const { githubSignals, scoreData, biasData, resumeVerification } = app
  const { profile, signals } = githubSignals

  const radarData = [
    { skill: 'Activity', value: signals.activelyContributing ? 85 : 25 },
    { skill: 'Repos', value: Math.min(profile.publicRepos * 4, 100) },
    { skill: 'Stars', value: Math.min(signals.totalStars * 8, 100) },
    { skill: 'Commits', value: Math.min(signals.totalCommitsSampled * 7, 100) },
    { skill: 'Complexity', value: signals.complexityLevel === 'Advanced' ? 90 : signals.complexityLevel === 'Intermediate' ? 60 : 30 },
    { skill: 'Languages', value: Math.min(signals.topLanguages.length * 18, 100) },
  ]

  const langData = signals.topLanguages.slice(0, 6).map(l => ({ name: l.lang, repos: l.count }))
  const vs = verdictStyle[scoreData?.verdict] || { text: 'text-white/50', bg: 'bg-white/5', border: 'border-white/10' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 50, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="bg-[#08080f] border border-white/8 rounded-3xl w-full max-w-2xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={anonymized ? 'blur-avatar' : ''}>
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt="" className="w-14 h-14 rounded-2xl border border-violet-500/30" />
                : <div className="w-14 h-14 rounded-2xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-bold text-xl">{profile.username[0].toUpperCase()}</div>
              }
            </div>
            <div>
              <h2 className={`text-xl font-bold text-white ${anonymized ? 'blur-name' : ''}`}>{profile.name || profile.username}</h2>
              <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer"
                className={`text-violet-400 text-sm hover:underline ${anonymized ? 'blur-name' : ''}`}>@{profile.username}</a>
              {profile.bio && <p className="text-white/35 text-xs mt-0.5 max-w-xs truncate">{profile.bio}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAnonymized(!anonymized)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${anonymized ? 'bg-violet-600/20 border-violet-500/40 text-violet-300' : 'glass border-white/10 text-white/50 hover:text-white'}`}>
              {anonymized ? '👁 Reveal' : '🫥 Anonymize'}
            </motion.button>
            <button onClick={onClose} className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white/30 hover:text-white transition-colors">✕</button>
          </div>
        </div>

        {anonymized && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="glass-purple rounded-xl px-4 py-2.5 text-violet-300 text-xs flex items-center gap-2">
            <span>⚖️</span>
            <span>Anonymized mode — name, photo hidden. Score unchanged: <strong>{scoreData?.score}/100</strong></span>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Match Score</div>
            <ScoreRing score={scoreData?.score || 0} />
            {scoreData?.verdict && (
              <span className={`mt-3 px-3 py-1 rounded-xl border text-xs font-semibold ${vs.text} ${vs.bg} ${vs.border}`}>
                {scoreData.verdict}
              </span>
            )}
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="text-white/40 text-xs font-medium mb-2 uppercase tracking-wider">Skill Radar</div>
            <ResponsiveContainer width="100%" height={150}>
              <RadarChart data={radarData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }} />
                <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={1.5} dot={{ fill: '#7c3aed', r: 2 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {scoreData?.reasoning && (
          <div className="glass rounded-xl p-4 border-l-2 border-violet-500/50">
            <div className="text-violet-400 text-xs font-semibold mb-1.5">💡 AI Reasoning</div>
            <p className="text-white/65 text-sm leading-relaxed">{scoreData.reasoning}</p>
          </div>
        )}

        <div className="glass rounded-2xl p-4">
          <div className="text-white/40 text-xs font-medium mb-3 uppercase tracking-wider">Language Distribution</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={langData} barSize={22} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
              <Bar dataKey="repos" radius={[5, 5, 0, 0]}>
                {langData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Repos', value: profile.publicRepos, icon: '📁' },
            { label: 'Stars', value: signals.totalStars, icon: '⭐' },
            { label: 'Level', value: signals.complexityLevel, icon: '🧠' },
            { label: 'Commits', value: signals.totalCommitsSampled, icon: '💾' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-xl p-3 text-center">
              <div className="text-base mb-1">{s.icon}</div>
              <div className="text-violet-400 font-bold text-sm">{s.value}</div>
              <div className="text-white/25 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <div className="text-emerald-400 text-xs font-semibold mb-2">✅ Matched Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {scoreData?.matchedSkills?.map((s, i) => (
                <span key={i} className="bg-emerald-500/10 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
            <div className="text-red-400 text-xs font-semibold mb-2">❌ Missing Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {scoreData?.missingSkills?.map((s, i) => (
                <span key={i} className="bg-red-500/10 text-red-300 text-xs px-2 py-0.5 rounded-full border border-red-500/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-3">
            <div className="text-white/35 text-xs mb-1">💪 Strength</div>
            <p className="text-white text-sm">{scoreData?.topStrength || 'N/A'}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-white/35 text-xs mb-1">⚠️ Risk</div>
            <p className="text-white text-sm">{scoreData?.riskFlag || 'None'}</p>
          </div>
        </div>

        {resumeVerification && (
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/50 text-xs font-semibold uppercase tracking-wider">🔍 Resume Verification</div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                resumeVerification.verification?.trustLevel === 'High Trust' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                resumeVerification.verification?.trustLevel === 'Suspicious' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                'text-amber-400 border-amber-400/30 bg-amber-400/10'
              }`}>{resumeVerification.verification?.trustLevel}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${resumeVerification.verification?.verificationScore}%` }} transition={{ duration: 1 }}
                className={`h-1.5 rounded-full ${resumeVerification.verification?.verificationScore > 70 ? 'bg-emerald-500' : resumeVerification.verification?.verificationScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
            </div>
            <p className="text-white/40 text-xs">{resumeVerification.verification?.verdict}</p>
          </div>
        )}

        {biasData && (
          <div className={`rounded-xl p-4 border ${biasData.biasDetected ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/15'}`}>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">⚖️ Bias Check</div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: 'With Identity', value: biasData.scoreWithIdentity },
                { label: 'Without Identity', value: biasData.scoreWithoutIdentity },
                { label: 'Δ Difference', value: biasData.difference },
              ].map((s, i) => (
                <div key={i} className="glass rounded-lg p-2 text-center">
                  <div className={`font-bold ${i === 2 ? (biasData.biasDetected ? 'text-amber-400' : 'text-emerald-400') : 'text-white'}`}>{s.value}</div>
                  <div className="text-white/25 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <p className={`text-xs font-medium ${biasData.biasDetected ? 'text-amber-400' : 'text-emerald-400'}`}>{biasData.verdict}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingApps, setLoadingApps] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  useEffect(() => {
    axios.get('/api/jobs').then(r => { setJobs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const loadApplications = async (job) => {
    setSelectedJob(job)
    setLoadingApps(true)
    try {
      const res = await axios.get(`/api/jobs/${job._id}/applications`)
      setApplications(res.data)
    } catch { setApplications([]) }
    finally { setLoadingApps(false) }
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: '1280px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '56px', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div className="page-tag">🏢 Recruiter Portal</div>
            <h1 className="page-title">Recruiter <span className="gradient-text">Dashboard</span></h1>
            <p className="page-subtitle">AI-verified candidates · ranked by real GitHub signals</p>
          </div>
          <Link to="/recruiter/post-job">
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.96 }}
              className="btn-primary">
              + Post New Job
            </motion.button>
          </Link>
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

          {/* Jobs sidebar */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>
              Jobs ({jobs.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {loading ? (
                <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>Loading...</div>
              ) : jobs.length === 0 ? (
                <div className="card" style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '12px' }}>No jobs yet</div>
                  <Link to="/recruiter/post-job" style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none' }}>Post first job →</Link>
                </div>
              ) : jobs.map(job => (
                <motion.div key={job._id} whileHover={{ scale: 1.01 }} onClick={() => loadApplications(job)}
                  style={{
                    background: selectedJob?._id === job._id ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${selectedJob?._id === job._id ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '16px', padding: '18px 20px', cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: selectedJob?._id === job._id ? '0 0 20px rgba(124,58,237,0.12)' : 'none'
                  }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{job.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginBottom: '10px' }}>{job.company}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {job.experience && <span style={{ color: '#a78bfa', fontSize: '11px', fontWeight: 600 }}>{job.experience}</span>}
                    {job.remote && <span style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '11px', padding: '2px 10px', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>Remote</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Applications panel */}
          <div>
            {!selectedJob ? (
              <div className="card" style={{ minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px' }}>
                <motion.div animate={{ x: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ fontSize: '40px', marginBottom: '16px' }}>👈</motion.div>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '15px' }}>Select a job to view applicants</div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.3px', marginBottom: '4px' }}>{selectedJob.title}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>{applications.length} applicants · sorted by AI score</p>
                </div>

                {loadingApps ? (
                  <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }}>Analyzing candidates...</div>
                ) : applications.length === 0 ? (
                  <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>⏳</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No applicants yet</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {applications.map((app, i) => {
                      const vs = verdictStyle[app.scoreData?.verdict] || { text: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10' }
                      return (
                        <motion.div key={app._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="card" style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                              {app.avatarUrl
                                ? <img src={app.avatarUrl} alt="" style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid rgba(124,58,237,0.25)' }} />
                                : <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: 700, fontSize: '16px' }}>{app.username?.[0]?.toUpperCase()}</div>
                              }
                              <div style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 900, background: i === 0 ? '#eab308' : i === 1 ? '#94a3b8' : i === 2 ? '#f97316' : '#7c3aed' }}>
                                {i + 1}
                              </div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.candidateName || app.username}</div>
                              <a href={`https://github.com/${app.username}`} target="_blank" rel="noreferrer" style={{ color: '#a78bfa', fontSize: '12px', textDecoration: 'none' }}>@{app.username}</a>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: '26px', fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}>{app.scoreData?.score ?? '—'}</div>
                              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>/100</div>
                            </div>
                          </div>

                          <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', height: '3px', marginBottom: '14px' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${app.scoreData?.score || 0}%` }} transition={{ duration: 1, delay: i * 0.08 }}
                              style={{ height: '3px', borderRadius: '50px', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                            {app.scoreData?.verdict && (
                              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${vs.text} ${vs.bg} ${vs.border}`}>{app.scoreData.verdict}</span>
                            )}
                            {app.biasData?.biasDetected === false && <span style={{ color: '#34d399', fontSize: '11px', background: 'rgba(16,185,129,0.08)', padding: '3px 10px', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>⚖️ Bias Free</span>}
                            {app.resumeVerification && <span style={{ color: '#60a5fa', fontSize: '11px', background: 'rgba(59,130,246,0.08)', padding: '3px 10px', borderRadius: '50px', border: '1px solid rgba(59,130,246,0.2)', fontWeight: 600 }}>📄 Verified</span>}
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <a href={`https://github.com/${app.username}`} target="_blank" rel="noreferrer"
                              style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '9px', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s ease', fontWeight: 500 }}>
                              GitHub
                            </a>
                            <button onClick={() => setSelectedCandidate(app)}
                              style={{ flex: 1, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', fontSize: '12px', padding: '9px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s ease' }}>
                              Full Report →
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCandidate && <CandidateModal app={selectedCandidate} onClose={() => setSelectedCandidate(null)} />}
      </AnimatePresence>
    </div>
  )
}
