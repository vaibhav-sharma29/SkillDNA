const express = require('express')
const axios = require('axios')
const router = express.Router()

const ghHeaders = () => process.env.GITHUB_TOKEN
  ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  : {}

// Fetch full GitHub signals for a username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const headers = ghHeaders()

    const [userRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, { headers })
    ])

    const user = userRes.data
    const repos = reposRes.data

    const languageMap = {}
    repos.forEach(repo => {
      if (repo.language) languageMap[repo.language] = (languageMap[repo.language] || 0) + 1
    })

    const topLanguages = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, count]) => ({ lang, count }))

    const topRepos = repos.slice(0, 5)
    let totalCommits = 0
    let commitDetails = []

    for (const repo of topRepos) {
      try {
        const commitsRes = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=10`,
          { headers }
        )
        totalCommits += commitsRes.data.length
        commitDetails.push({
          repo: repo.name,
          commits: commitsRes.data.length,
          lastCommit: commitsRes.data[0]?.commit?.author?.date || null,
          sampleMessages: commitsRes.data.slice(0, 3).map(c => c.commit.message)
        })
      } catch {}
    }

    const lastActive = repos[0]?.pushed_at ? new Date(repos[0].pushed_at) : null
    const daysSinceActive = lastActive
      ? Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24))
      : null

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

    const avgRepoSize = repos.length
      ? repos.reduce((sum, r) => sum + r.size, 0) / repos.length
      : 0

    const complexityLevel =
      avgRepoSize > 5000 ? 'Advanced' :
      avgRepoSize > 1000 ? 'Intermediate' :
      'Beginner'

    res.json({
      profile: {
        username: user.login,
        name: user.name,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        accountCreated: user.created_at,
        avatarUrl: user.avatar_url
      },
      signals: {
        topLanguages,
        totalStars,
        totalForks,
        totalCommitsSampled: totalCommits,
        commitDetails,
        daysSinceLastActive: daysSinceActive,
        complexityLevel,
        activelyContributing: daysSinceActive !== null && daysSinceActive < 30
      }
    })
  } catch (err) {
    res.status(404).json({ error: 'GitHub user not found or API limit reached' })
  }
})

module.exports = router
