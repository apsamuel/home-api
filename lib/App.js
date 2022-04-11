import express from 'express';
import cors from 'cors';
import { HomeData } from '@apsamuel/home-data';

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

app.get('/api/resume', async (req, res) => {

  res.json(data.resume)
    .status(200)
    .end();

  console.log(
    JSON.stringify({
      event: req.method,
      time: new Date().toJSON(),
      route: '/api/resume',
      params: req.params,
      headers: req.headers,
    })
  );
});



// const port = 8081;
// const server = app.listen(port, (err) => {
//   console[err ? 'error' : 'log'](err || `Server running on ${port}`);
// });
