import express from 'express';
import cors from 'cors';
import { HomeData } from '@apsamuel/home-data';
import {
  getItems
} from './Dynamo.js'

import {
  resumeGeneralInfo
} from './resumeGeneralInfo.js'

import {
  resumeSkillInfo
} from './resumeSkillInfo.js'

import {
  resumeEducationHistory
} from './resumeEducationHistory.js'

export const app = express();

app.use(cors());
app.use(express.json());

const data = new HomeData();

// home API routes

app.get('/favicon.ico', (req, res) => {
  console.log(
    JSON.stringify({
      event: req.method,
      time: new Date().toJSON(),
      route: '/favicon.ico',
      params: req.params,
      headers: req.headers,
    })
  );
  res
    .status(204)
    .end();
});

app.get('/api/health', async (req, res) => {
  console.log(
    JSON.stringify({
      event: req.method,
      time: new Date().toJSON(),
      route: '/api/health',
      params: req.params,
      headers: req.headers,
    })
  );
  res.json({
    state: 'running',
    uptime: process.uptime(),
  })
    .status(200)
    .end()
});

app.get('/api/resume/general', async (req, res) => {
  const general = resumeGeneralInfo()
  res.json(general)
    .status(200)
    .end()
})

app.get('/api/resume/skills', async (req, res) => {
  const skills = resumeSkillInfo()
  res.json(skills)
    .status(200)
    .end()
})

app.get('/api/resume/education', async (req, res) => {
  const education = resumeEducationHistory()
  res.json(education)
    .status(200)
    .end()
})

app.get('/api/resume/workhistory', async (req, res) => {
  const tableName = 'workHistory'
  const workHistory = await getItems(tableName)
  res.json(workHistory)
    .status(200)
    .end()
})