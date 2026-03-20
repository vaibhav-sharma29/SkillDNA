const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// MongoDB connect
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skilldna')
  .then(() => console.log('MongoDB connected'))
  .catch(() => console.log('MongoDB not connected - running without DB'))

// Routes
app.use('/api/github', require('./routes/github'))
app.use('/api/analyze', require('./routes/analyze'))
app.use('/api/bias', require('./routes/bias'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SkillDNA API running' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`SkillDNA server running on port ${PORT}`))
