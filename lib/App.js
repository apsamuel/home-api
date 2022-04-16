import express from 'express';
import cors from 'cors';
// import { filterList } from './Commons.js';

import {
  getItem,
  getItems,
  queryItems,
  deleteItem,
  putItem
} from '@apsamuel/home-data'

import {
  resumeGeneralInfo,
  resumeSkillInfo,
  resumeEducationHistory,
} from '@apsamuel/home-data'


export const app = express();

app.use(cors());
app.use(express.json());

// const data = new HomeData();

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
  // console.log(
  //   JSON.stringify({
  //     event: req.method,
  //     time: new Date().toJSON(),
  //     route: '/api/health',
  //     params: req.params,
  //     headers: req.headers,
  //   })
  // );
  res.json({
    state: 'running',
    time: new Date().toJSON(),
    uptime: process.uptime(),
    headers: req.headers
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

app.get('/api/resume/workhistory/:companyId', async (req, res) => {
  const tableName = 'workHistory';
  const indexName = 'workHistoryIndex';
  const companyId = req.params.companyId;
  const params = {
    companyId,
  };
  const workHistoryEntry = await getItem(tableName, params)
  res.json(workHistoryEntry).status(200).end();
})

app.get('/api/resume/rolehistory', async (req, res) => {
  const tableName = 'roleHistory';
  const roleHistory = await getItems(tableName);
  res.json(roleHistory).status(200).end();
});


app.get('/api/resume/rolehistory/:companyId', async (req, res) => {
  const tableName = 'roleHistory';
  const indexName = 'roleHistoryIndex'
  const companyId = req.params.companyId;
  // const workHistoryEntry = await getItem()
  const params = {
    companyId,
  };
  const workHistoryItem = await getItem(tableName, params);
  const { companyName } = workHistoryItem
  const roleHistoryEntries = await queryItems(tableName, indexName, params)
  res.json(roleHistoryEntries.Items).status(200).end();
});
