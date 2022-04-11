import express from 'express'
import cors from 'cors'
import { HomeData } from '@apsamuel/home-data'

const app = express()

app.use(cors())
app.use(express.json())

const data = new HomeData()

app.get('/favicon.ico', (req, res) => {
  console.log('serving favicon')
  res.status(204).end()
})

app.get('/api/health', async (req, res) => {
  console.log('serving health endpoint')
  res.json({
    state: 'running',
    uptime: process.uptime(),
  })
})

app.get('/api/resume', async (req, res) => {
  console.log('serving resume')
  res.json(data.resume)
})


const port = 8081
const server = app.listen(port, err => {
  console[err ? 'error' : 'log'](err || `Server running on ${port}`)
})
