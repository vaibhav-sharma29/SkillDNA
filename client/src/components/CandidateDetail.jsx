import { motion, AnimatePresence } from 'framer-motion'

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

export default function CandidateDetail({ app, onClose }) {
  if (!app) return null
  const { githubSignals, scoreData, biasData, resumeVerification } = app
  const { profile, signals } = githubSignals

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40 }}
          className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-3xl space-y-5 p-6"
          onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.username} className="w-14 h-14 rounded-full border-2 border-violet-500" />}
              <div>
                <h2 className="text-xl font-bold text-white">{profile.name || profile.username}</h2>
                <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer"
                  className="text-violet-400 text-sm hover:underline">@{profile.username}</a>
                {profile.bio && <p className="text-white/40 text-xs mt-0.5">{profile.bio}</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white text-2xl transition-colors">✕</button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {scoreData?.verdict && (
              <span className={`px-3 py-1 rounded-xl border text-sm font-semibold ${verdictColor[scoreData.verdict] || 'text-white/50 bg-white/5 border-white/10'}`}>
                {scoreData.verdict}
              </span>
            )}
            <span className="text-3xl font-bold text-violet-400">{scoreData?.score}<span className="text-white/30 text-lg">/100</span></span>
            {signals.activelyContributing
              ? <span className="bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/20">🟢 Active</span>
              : <span className="bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/20">🔴 Inactive</span>
            }
          </div>

          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${scoreData?.score}%` }} transition={{ duration: 1 }}
              className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
          </div>

          {scoreData?.reasoning && (
            <p className="text-white/60 text-sm bg-white/5 rounded-xl p-4">{scoreData.reasoning}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Public Repos', value: profile.publicRepos, icon: '📁' },
              { label: 'Total Stars', value: signals.totalStars, icon: '⭐' },
              { label: 'Complexity', value: signals.complexityLevel, icon: '🧠' },
              { label: 'Commits Sampled', value: signals.totalCommitsSampled, icon: '💾' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-violet-400 font-bold text-lg">{stat.value}</div>
                <div className="text-white/40 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white/70 text-sm font-semibold mb-3">🛠 Top Languages</h3>
            <div className="flex flex-wrap gap-2">
              {signals.topLanguages.map((l, i) => (
                <span key={i} className="bg-violet-500/10 text-violet-300 text-sm px-3 py-1 rounded-full border border-violet-500/20">
                  {l.lang} · {l.count} repos
                </span>
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
                <span className={`px-3 py-1 rounded-xl border text-xs font-semibold ${trustColor[resumeVerification.verification?.trustLevel] || 'text-white/50 bg-white/5 border-white/10'}`}>
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
    </AnimatePresence>
  )
}
