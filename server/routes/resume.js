const express = require('express')
const multer = require('multer')
const PDFParser = require('pdf2json')
const Groq = require('groq-sdk')
const router = express.Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY })

router.post('/verify', upload.single('resume'), async (req, res) => {
  try {
    const { githubSignals } = JSON.parse(req.body.data)
    const { profile, signals } = githubSignals

    const resumeText = await new Promise((resolve, reject) => {
      const parser = new PDFParser()
      parser.on('pdfParser_dataReady', data => {
        const text = data.Pages.map(p => p.Texts.map(t => { try { return decodeURIComponent(t.R[0].T) } catch { return t.R[0].T } }).join(' ')).join('\n')
        resolve(text)
      })
      parser.on('pdfParser_dataError', reject)
      parser.parseBuffer(req.file.buffer)
    })

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Try a text-based PDF (not scanned image).' })
    }

    const extractPrompt = `Extract all technical skills, programming languages, frameworks, tools, and years of experience claims from this resume text. Return ONLY valid JSON:
{
  "skills": ["skill1", "skill2"],
  "experienceClaims": ["claim1", "claim2"],
  "summary": "1 sentence about candidate background"
}

RESUME TEXT:
${resumeText.slice(0, 3000)}`

    const extractRes = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: extractPrompt }],
      temperature: 0.1
    })

    const extractRaw = extractRes.choices[0].message.content.trim()
    const extractMatch = extractRaw.match(/\{[\s\S]*\}/)
    if (!extractMatch) throw new Error('Failed to extract resume skills')
    const resumeData = JSON.parse(extractMatch[0])

    const githubLanguages = signals.topLanguages.map(l => l.lang.toLowerCase())
    const resumeSkillsLower = resumeData.skills.map(s => s.toLowerCase())

    const verifyPrompt = `You are a talent verification engine. Compare resume claims against real GitHub evidence.

RESUME CLAIMS:
Skills: ${resumeData.skills.join(', ')}
Experience Claims: ${resumeData.experienceClaims.join(', ')}

GITHUB REALITY:
- Languages used: ${signals.topLanguages.map(l => `${l.lang}(${l.count} repos)`).join(', ')}
- Total repos: ${profile.publicRepos}
- Total stars: ${signals.totalStars}
- Complexity: ${signals.complexityLevel}
- Active last 30 days: ${signals.activelyContributing}
- Account age signals: ${signals.daysSinceLastActive} days since last active
- Total commits sampled: ${signals.totalCommitsSampled}

Return ONLY valid JSON:
{
  "verifiedSkills": ["skills that appear in both resume and GitHub"],
  "unverifiedSkills": ["skills claimed in resume but no GitHub evidence"],
  "contradictions": ["specific contradictions found"],
  "verificationScore": <0-100>,
  "trustLevel": "High Trust | Medium Trust | Low Trust | Suspicious",
  "verdict": "2-3 sentence honest assessment"
}`

    const verifyRes = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: verifyPrompt }],
      temperature: 0.2
    })

    const verifyRaw = verifyRes.choices[0].message.content.trim()
    const verifyMatch = verifyRaw.match(/\{[\s\S]*\}/)
    if (!verifyMatch) throw new Error('Failed to verify resume')
    const verifyData = JSON.parse(verifyMatch[0])

    res.json({
      success: true,
      resumeData,
      verification: verifyData
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
