import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const verdictColor = {
  'Strong Match': 'text-green-400 bg-green-400/10 border-green-400/30',
  'Good Match': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'Partial Match': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Weak Match': 'text-red-400 bg-red-400/10 border-red-400/30',
}

const trustColor = {
  'High Trust': 'text-green-400 bg-green-400/10 border-green-400/30',
  'Medium Trust': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'Low Trust': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Suspicious': 'text-red-400 bg-red-400/10 border-red-400/30',
}

function CandidateModal({ app, onClose }) {
  const { githubSignals, scoreData, biasData, resumeVerification } = app
  const { profile, signals } = githubSignals
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
        className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-3xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.username} className="w-14 h-14 rounded-full border-2 border-violet-500" />}
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name || profile.username}</h2>
              <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer" className="text-violet-400 text-sm hover:underline">@{profile.username}</a>
              {profile.bio && <p className="text-white/40 text-xs mt-0.5">{profile.bio}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white text-2xl transition-colors">✕</button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {scoreData?.verdict && <span className={`px-3 py-1 rounded-xl border text-sm font-semibold ${verdictColor[scoreData.verdict] || ''}`}>{scoreData.verdict}</span>}
          <span className="text-3xl font-bold text-violet-400">{scoreData?.score}<span className="text-white/30 text-lg">/100</span></span>
          <span className={`text-xs px-3 py-1 rounded-full border ${signals.activelyContributing ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {signals.activelyContributing ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </div>

        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${scoreData?.score}%` }} transition={{ duration: 1 }}
            className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
        </div>

        {scoreData?.reasoning && <p className="text-white/60 text-sm bg-white/5 rounded-xl p-4">{scoreData.reasoning}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Public Repos', value: profile.publicRepos, icon: '📁' },
            { label: 'Total Stars', value: signals.totalStars, icon: '⭐' },
            { label: 'Complexity', value: signals.complexityLevel, icon: '🧠' },
            { label: 'Commits Sampled', value: signals.totalCommitsSampled, icon: '💾' },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-violet-400 font-bold text-lg">{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white/70 text-sm font-semibold mb-3">🛠 Top Languages</h3>
          <div className="flex flex-wrap gap-2">
            {signals.topLanguages.map((l, i) => (
              <span key={i} className="bg-violet-500/10 text-violet-300 text-sm px-3 py-1 rounded-full border border-violet-500/20">{l.lang} · {l.count} repos</span>
            ))}
          </div>
        </div>

        {signals.commitDetails?.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white/70 text-sm font-semibold mb-3">📊 Commit Activity</h3>
            <div className="space-y-2">
              {signals.commitDetails.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{c.repo}</span>
                  <span className="text-violet-400 text-sm font-medium">{c.commits} commits</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <h3 className="text-green-400 text-sm font-semibold mb-2">✅ Matched Skills</h3>
            <div className="flex flex-wrap gap-1">
              {scoreData?.matchedSkills?.map((s, i) => (
                <span key={i} className="bg-green-500/10 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/20">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h3 className="text-red-400 text-sm font-semibold mb-2">❌ Missing Skills</h3>
            <div className="flex flex-wrap gap-1">
              {scoreData?.missingSkills?.map((s, i) => (
                <span key={i} className="bg-red-500/10 text-red-300 text-xs px-2 py-1 rounded-full border border-red-500/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white/60 text-sm font-semibold mb-2">💪 Top Strength</h3>
            <p className="text-white text-sm">{scoreData?.topStrength || 'N/A'}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white/60 text-sm font-semibold mb-2">⚠️ Risk Flag</h3>
            <p className="text-white text-sm">{scoreData?.riskFlag || 'None identified'}</p>
          </div>
        </div>

        {resumeVerification && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/70 text-sm font-semibold">🔍 Resume Verification</h3>
              <span className={`px-3 py-1 rounded-xl border text-xs font-semibold ${trustColor[resumeVerification.verification?.trustLevel] || ''}`}>
                {resumeVerification.verification?.trustLevel}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div className={`h-2 rounded-full ${resumeVerification.verification?.verificationScore > 70 ? 'bg-green-500' : resumeVerification.verification?.verificationScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${resumeVerification.verification?.verificationScore}%` }} />
            </div>
            <p className="text-white/50 text-xs">{resumeVerification.verification?.verdict}</p>
          </div>
        )}

        {biasData && (
          <div className={`border rounded-xl p-4 ${biasData.biasDetected ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
            <h3 className="text-white/70 text-sm font-semibold mb-3">⚖️ Bias Check</h3>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {[
                { label: 'With Identity', value: biasData.scoreWithIdentity },
                { label: 'Without Identity', value: biasData.scoreWithoutIdentity },
                { label: 'Difference', value: biasData.difference },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-2 text-center">
                  <div className={`font-bold ${i === 2 ? (biasData.biasDetected ? 'text-yellow-400' : 'text-green-400') : 'text-white'}`}>{s.value}</div>
                  <div className="text-white/30 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
            <p className={`text-xs font-medium ${biasData.biasDetected ? 'text-yellow-400' : 'text-green-400'}`}>{biasData.verdict}</p>
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
    <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Recruiter <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Dashboard</span></h1>
            <p className="text-white/50">Manage jobs and review AI-verified candidates</p>
          </div>
          <Link to="/recruiter/post-job">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              + Post New Job
            </motion.button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wider">Posted Jobs ({jobs.length})</h2>
            {loading ? <div className="text-white/30 text-sm">Loading...</div>
              : jobs.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-white/40 text-sm">No jobs posted yet</div>
                  <Link to="/recruiter/post-job" className="text-violet-400 text-sm hover:underline mt-2 block">Post your first job →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map(job => (
                    <motion.div key={job._id} whileHover={{ scale: 1.02 }} onClick={() => loadApplications(job)}
                      className={`bg-white/5 border rounded-xl p-4 cursor-pointer transition-colors ${selectedJob?._id === job._id ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 hover:border-white/20'}`}>
                      <div className="text-white font-medium text-sm">{job.title}</div>
                      <div className="text-white/40 text-xs mt-1">{job.company}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-violet-400 text-xs">{job.experience}</span>
                        {job.remote && <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/20">Remote</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
          </div>

          <div className="md:col-span-2">
            {!selectedJob ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-4xl mb-3">👈</div>
                <div className="text-white/40">Select a job to view applicants</div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold text-lg">Applicants for <span className="text-violet-400">{selectedJob.title}</span></h2>
                  <span className="text-white/40 text-sm">{applications.length} total</span>
                </div>
                {loadingApps ? <div className="text-white/30 text-sm">Loading applicants...</div>
                  : applications.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                      <div className="text-3xl mb-2">⏳</div>
                      <div className="text-white/40 text-sm">No applicants yet</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app, i) => (
                        <motion.div key={app._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="relative">
                              {app.avatarUrl && <img src={app.avatarUrl} alt={app.username} className="w-12 h-12 rounded-full border-2 border-violet-500/50" />}
                              <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold">#{i + 1}</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold">{app.candidateName || app.username}</div>
                              <a href={`https://github.com/${app.username}`} target="_blank" rel="noreferrer" className="text-violet-400 text-xs hover:underline">@{app.username}</a>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-violet-400">{app.scoreData?.score ?? 'N/A'}</div>
                              <div className="text-white/30 text-xs">/100</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {app.scoreData?.verdict && (
                              <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${verdictColor[app.scoreData.verdict] || ''}`}>{app.scoreData.verdict}</span>
                            )}
                            {app.biasData?.biasDetected === false && <span className="text-green-400 text-xs">⚖️ Bias Free</span>}
                            {app.resumeVerification && <span className="text-blue-400 text-xs">📄 Resume Verified</span>}
                          </div>

                          <div className="flex gap-2">
                            <a href={`https://github.com/${app.username}`} target="_blank" rel="noreferrer"
                              className="flex-1 text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-xs py-2 rounded-lg transition-colors">
                              View GitHub
                            </a>
                            <button onClick={() => setSelectedCandidate(app)}
                              className="flex-1 text-center bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 text-xs py-2 rounded-lg transition-colors">
                              See Details →
                            </button>
                          </div>
                        </motion.div>
                      ))}
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
