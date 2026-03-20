const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  skills: [String],
  experience: String,
  remote: Boolean
}, { timestamps: true })

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  username: String,
  candidateName: String,
  avatarUrl: String,
  resumeText: String,
  githubSignals: Object,
  scoreData: Object,
  resumeVerification: Object,
  biasData: Object
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)
const Application = mongoose.model('Application', applicationSchema)

router.post('/', async (req, res) => {
  try {
    const job = await Job.create(req.body)
    res.json({ success: true, job })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ error: 'Job not found' })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/:id/apply', async (req, res) => {
  try {
    const existing = await Application.findOne({ jobId: req.params.id, username: req.body.username })
    if (existing) return res.status(400).json({ error: 'Already applied for this job' })
    const application = await Application.create({ jobId: req.params.id, ...req.body })
    res.json({ success: true, application })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id/applications', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.id }).sort({ 'scoreData.score': -1 })
    res.json(applications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = { router, Job, Application }
