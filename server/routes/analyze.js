const express = require('express')
const Groq = require('groq-sdk')
const router = express.Router()

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/score', async (req, res) => {
  try {
    const { githubSignals, jobDescription, candidateMeta } = req.body
    const { profile, signals } = githubSignals
    const languages = signals.topLanguages.map(l => `${l.lang}(${l.count} repos)`).join(', ')

    const prompt = `You are a talent intelligence engine. Analyze this candidate's real GitHub activity against the job description.

CANDIDATE GITHUB DATA:
- Name: ${candidateMeta?.name || profile.name || profile.username}
- Top Languages: ${languages}
- Total Public Repos: ${profile.publicRepos}
- Total Stars Earned: ${signals.totalStars}
- Complexity Level: ${signals.complexityLevel}
- Actively Contributing (last 30 days): ${signals.activelyContributing}
- Days Since Last Active: ${signals.daysSinceLastActive}
- Total Commits Sampled: ${signals.totalCommitsSampled}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object in this exact format:
{
  "score": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "reasoning": "2-3 sentence explanation of why this score",
  "topStrength": "single biggest strength of this candidate",
  "riskFlag": "single biggest concern or null if none",
  "verdict": "Strong Match | Good Match | Partial Match | Weak Match"
}`

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })

    const raw = completion.choices[0].message.content.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    const result = JSON.parse(jsonMatch[0])
    res.json({ success: true, username: profile.username, ...result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/rank', async (req, res) => {
  try {
    const { candidates, jobDescription } = req.body
    const results = []

    for (const candidate of candidates) {
      const { githubSignals, candidateMeta } = candidate
      const { profile, signals } = githubSignals
      const languages = signals.topLanguages.map(l => `${l.lang}(${l.count} repos)`).join(', ')

      const prompt = `You are a talent intelligence engine. Analyze this candidate's real GitHub activity against the job description.

CANDIDATE GITHUB DATA:
- Name: ${candidateMeta?.name || profile.name || profile.username}
- Top Languages: ${languages}
- Total Public Repos: ${profile.publicRepos}
- Total Stars Earned: ${signals.totalStars}
- Complexity Level: ${signals.complexityLevel}
- Actively Contributing (last 30 days): ${signals.activelyContributing}
- Days Since Last Active: ${signals.daysSinceLastActive}
- Total Commits Sampled: ${signals.totalCommitsSampled}

JOB DESCRIPTION:
${jobDescription}

Return ONLY a valid JSON object:
{
  "score": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "reasoning": "2-3 sentence explanation",
  "topStrength": "biggest strength",
  "riskFlag": "biggest concern or null",
  "verdict": "Strong Match | Good Match | Partial Match | Weak Match"
}`

      const completion = await getGroq().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      })

      const raw = completion.choices[0].message.content.trim()
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        results.push({ username: profile.username, avatarUrl: profile.avatarUrl, ...result })
      }
    }

    results.sort((a, b) => b.score - a.score)
    const ranked = results.map((r, i) => ({ rank: i + 1, ...r }))
    res.json({ success: true, ranked })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
