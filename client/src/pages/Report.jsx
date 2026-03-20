import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

export default function Report() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`report_${username}`)
    if (!stored) { navigate('/analyze'); return }
    setData(JSON.parse(stored))
  }, [username])

  if (!data) return null

  const { githubSignals, scoreData, biasData, resumeVerification } = data
  const { profile, signals } = githubSignals

  return (
    <div className="min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-5">

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
        <img src={profile.avatarUrl} alt={profile.username} className="w-16 h-16 rounded-full border-2 border-violet-500" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{profile.name || profile.username}</h1>
          <a href={`https://github.com/${profile.username}`} target="_blank" rel="noreferrer"
            className="text-violet-400 text-sm hover:underline">@{profile.username}</a>
          {profile.bio && <p className="text-white/40 text-sm mt-1">{profile.bio}</p>}
        </div>
        <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${verdictColor[scoreData.verdict] || 'text-white/60 bg-white/5 border-white/10'}`}>
          {scoreData.verdict}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">🎯 AI Match Score</h2>
          <span className="text-4xl font-bold text-violet-400">{scoreData.score}<span className="text-white/30 text-xl">/100</span></span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scoreData.score}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
          />
        </div>
        <p className="text-white/60 text-sm">{scoreData.reasoning}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
          <h3 className="text-green-400 font-semibold mb-3">✅ Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {scoreData.matchedSkills?.map((s, i) => (
              <span key={i} className="bg-green-500/10 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/20">{s}</span>
            ))}
          </div>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <h3 className="text-red-400 font-semibold mb-3">❌ Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {scoreData.missingSkills?.map((s, i) => (
              <span key={i} className="bg-red-500/10 text-red-300 text-xs px-3 py-1 rounded-full border border-red-500/20">{s}</span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-white/70 font-semibold mb-2">💪 Top Strength</h3>
          <p className="text-white text-sm">{scoreData.topStrength}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-white/70 font-semibold mb-2">⚠️ Risk Flag</h3>
          <p className="text-white text-sm">{scoreData.riskFlag || 'None identified'}</p>
        </div>
      </motion.div>

      {resumeVerification && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg">🔍 Resume vs GitHub Verification</h2>
            <span className={`px-3 py-1 rounded-xl border text-sm font-semibold ${trustColor[resumeVerification.verification.trustLevel] || 'text-white/60 bg-white/5 border-white/10'}`}>
              {resumeVerification.verification.trustLevel}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-white/60 text-sm">Verification Score</span>
              <span className="text-white font-bold">{resumeVerification.verification.verificationScore}/100</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resumeVerification.verification.verificationScore}%` }}
                transition={{ duration: 1 }}
                className={`h-2 rounded-full ${resumeVerification.verification.verificationScore > 70 ? 'bg-green-500' : resumeVerification.verification.verificationScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
          </div>

          <p className="text-white/60 text-sm mb-5 bg-white/5 rounded-xl p-3">{resumeVerification.verification.verdict}</p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="text-green-400 text-sm font-semibold mb-2">✅ Verified</div>
              <div className="space-y-1">
                {resumeVerification.verification.verifiedSkills?.map((s, i) => (
                  <div key={i} className="text-green-300 text-xs bg-green-500/10 px-2 py-1 rounded-lg">{s}</div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 text-sm font-semibold mb-2">⚠️ Unverified</div>
              <div className="space-y-1">
                {resumeVerification.verification.unverifiedSkills?.map((s, i) => (
                  <div key={i} className="text-yellow-300 text-xs bg-yellow-500/10 px-2 py-1 rounded-lg">{s}</div>
                ))}
              </div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="text-red-400 text-sm font-semibold mb-2">❌ Contradictions</div>
              <div className="space-y-1">
                {resumeVerification.verification.contradictions?.length > 0
                  ? resumeVerification.verification.contradictions.map((s, i) => (
                    <div key={i} className="text-red-300 text-xs bg-red-500/10 px-2 py-1 rounded-lg">{s}</div>
                  ))
                  : <div className="text-white/30 text-xs">None found</div>
                }
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-lg mb-4">📊 GitHub Signals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Public Repos', value: profile.publicRepos, icon: '📁' },
            { label: 'Total Stars', value: signals.totalStars, icon: '⭐' },
            { label: 'Complexity', value: signals.complexityLevel, icon: '🧠' },
            { label: 'Days Since Active', value: signals.daysSinceLastActive ?? 'N/A', icon: '📅' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-violet-400 font-bold text-lg">{stat.value}</div>
              <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {signals.topLanguages.map((l, i) => (
            <span key={i} className="bg-violet-500/10 text-violet-300 text-xs px-3 py-1 rounded-full border border-violet-500/20">
              {l.lang} · {l.count} repos
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${signals.activelyContributing ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-white/50 text-sm">
            {signals.activelyContributing ? 'Actively contributing in last 30 days' : 'Not active in last 30 days'}
          </span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className={`border rounded-2xl p-6 ${biasData.biasDetected ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
        <h2 className="text-white font-semibold text-lg mb-4">⚖️ Bias-Free Verification</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Score with Identity', value: biasData.scoreWithIdentity },
            { label: 'Score without Identity', value: biasData.scoreWithoutIdentity },
            { label: 'Difference', value: biasData.difference },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
              <div className={`font-bold text-xl ${i === 2 ? (biasData.biasDetected ? 'text-yellow-400' : 'text-green-400') : 'text-white'}`}>{s.value}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <p className={`text-sm font-medium ${biasData.biasDetected ? 'text-yellow-400' : 'text-green-400'}`}>{biasData.verdict}</p>
      </motion.div>

    </div>
  )
}
