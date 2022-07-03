import express from 'express';
import cors from 'cors';

import {
  filterList,
  sortObject
} from '@apsamuel/home-data';

import {
  getFile,
  getFiles,
} from '@apsamuel/home-data'

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

import {
  statisticsForWorkHistory,
  statisticsForRoleHistory,
  statisticsForRoleTech,
  // summaryForRoleTech
} from './Helper.js'

export const app = express();

app.use(cors());
app.use(express.json());

// home API routes

app.get('/favicon.ico', (req, res) => {
  res
    .status(204)
    .end();
});

// return API service health
app.get('/api/health', async (req, res) => {
  res.json({
    state: 'running',
    time: new Date().toJSON(),
    uptime: process.uptime(),
    headers: req.headers
  })
    .status(200)
    .end()
});

// return General information for resume
app.get('/api/resume/general', async (req, res) => {
  const general = resumeGeneralInfo()
  res.json(general)
    .status(200)
    .end()
})

// return skill info
app.get('/api/resume/skills', async (req, res) => {
  const skills = resumeSkillInfo()
  res.json(skills)
    .status(200)
    .end()
})

// return education info
app.get('/api/resume/education', async (req, res) => {
  const education = resumeEducationHistory()
  res.json(education)
    .status(200)
    .end()
})

// return workhistory
app.get('/api/resume/workhistory', async (req, res) => {
  const tableName = 'workHistory'
  const workHistory = (await getItems(tableName)).sort(
    (a, b) =>
      new Date(
        `${a.companyStartYear}-${a.companyStartMonth}-${a.companyStartDay}`
      ).getTime() -
      new Date(
        `${b.companyStartYear}-${b.companyStartMonth}-${b.companyStartDay}`
      ).getTime()
  );

  res.json(workHistory)
    .status(200)
    .end()
})

// generate overall statistics for entire workhistory, traverses roles.
app.get('/api/resume/workhistory/stats', async (req, res) => {
  const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const oneDay = 1000 * 60 * 60 * 24;
  const tableName = 'workHistory';
  const workHistory = (await getItems(tableName)).sort(
    (a, b) =>
      new Date(
        `${a.companyStartYear}-${a.companyStartMonth}-${a.companyStartDay}`
      ).getTime() -
      new Date(
        `${b.companyStartYear}-${b.companyStartMonth}-${b.companyStartDay}`
      ).getTime()
  );
  const statistics = await statisticsForWorkHistory(workHistory)
  res.json(statistics).status(200).end();
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
  const roleHistory = (await getItems(tableName)).sort(
    (a, b) =>
      new Date(
        `${a.roleStartYear}-${a.roleStartMonth}-${a.roleStartDay}`
      ).getTime() -
      new Date(
        `${b.roleStartYear}-${b.roleStartMonth}-${b.roleStartDay}`
      ).getTime()
  );
  res.json(roleHistory).status(200).end();
});

app.get('/api/resume/rolehistory/:companyId', async (req, res) => {
  const tableName = 'roleHistory';
  const indexName = 'roleHistoryIndex'
  const companyId = req.params.companyId
  const params = {
    companyId,
  };
  const roleHistoryEntries = (
    await queryItems(tableName, indexName, {
      companyId,
    })
  )

  const roleHistory = roleHistoryEntries.Items
    .sort(
      (a, b) =>
        new Date(
          `${a.roleStartYear}-${a.roleStartMonth}-${a.roleStartDay}`
        ).getTime() -
        new Date(
          `${b.roleStartYear}-${b.roleStartMonth}-${b.roleStartDay}`
        ).getTime()
    );
  res.json(roleHistory)
    .status(200)
    .end();
});

app.get('/api/resume/rolehistory/:companyId/stats', async (req, res) => {
  const tableName = 'roleHistory';
  const indexName = 'roleHistoryIndex';
  const companyId = req.params.companyId;
  const params = {
    companyId,
  };

  const workHistoryEntry = await getItem('workHistory', params);
  const { companyStartDate, companyEndDate } = workHistoryEntry

  const companyStart = new Date(companyStartDate).getTime()
  const companyEnd =
    companyEndDate === 'current'
      ? new Date().getTime()
      : new Date(companyEndDate).getTime();
  const companyTime = companyEnd - companyStart
  const elapsedTimeInDays = companyTime / (1000 * 60 * 60 * 24)

  const roleHistoryEntries = await queryItems(tableName, indexName, {
    companyId,
  });
  // sorted by start dates
  const roleHistory = roleHistoryEntries.Items.sort(
    (a, b) =>
      new Date(
        `${a.roleStartYear}-${a.roleStartMonth}-${a.roleStartDay}`
      ).getTime() -
      new Date(
        `${b.roleStartYear}-${b.roleStartMonth}-${b.roleStartDay}`
      ).getTime()
  );

  const statistics = await statisticsForRoleHistory(roleHistory)


  // const totalRolesHeld = roleHistory.length
  // let totalDaysWorked = []
  // let totalTech = 0
  // let totalResponsibilities = 0
  // let roleNames = []
  // let totalMilestones = 0
  // let techNames = []

  // for (const role of roleHistory) {
  //   const { roleName } = role
  //   if (!roleNames.includes(roleName)) {
  //     roleNames.push(roleName)
  //   }
  //   const { roleStartDate, roleEndDate } = role
  //   const startDate = new Date(roleStartDate).getTime()
  //   const endDate = roleEndDate === 'current'
  //   ? new Date().getTime()
  //   : new Date(roleEndDate).getTime()
  //   const diffTime = endDate - startDate

  //   totalDaysWorked.push( diffTime / (1000 * 60 * 60 * 24));

  //   const { roleTech } = role
  //   totalTech += roleTech.length
  //   for (const roleTechEntry of roleTech) {
  //     const name = roleTechEntry.roleTechProvider === roleTechEntry.roleTechName
  //       ? roleTechEntry.roleTechName
  //       : `${roleTechEntry.roleTechProvider} ${roleTechEntry.roleTechName}`

  //     if (! techNames.includes(name)) {
  //       techNames.push(name)
  //     }
  //   }

  //   const { roleResponsibilities } = role
  //   totalResponsibilities += roleResponsibilities.length

  //   const { roleMilestones } = role
  //   totalMilestones += roleMilestones.length

  // }

  // const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
  res.json(statistics)
        .status(200)
        .end()
  // res
  //   .json( {
  //       totalRolesHeld,
  //       totalResponsibilities,
  //       totalMilestones,
  //       totalTech,
  //       techNames,
  //       roleNames,
  //       elapsedTimeInDays,
  //       averageDaysPerRole: average(totalDaysWorked)
  //     }
  //   )
  //   .status(200)
  //   .end();
});

app.get('/api/static/images', async (req, res) => {
  const bucketName = 'darkphoton-home-data';
  const data = await getFiles(bucketName)
  res.json(data)
    .status(200)
    .end();
})

app.get('/api/static/images/:imageId', async (req, res) => {
  const bucketName = 'darkphoton-home-data'
  const prefix = 'static/images'
  const keyName = `${prefix}/${req.params.imageId}`
  const imageData = await getFile(bucketName, keyName)
  console.log(
    {
      key: keyName,
      mime: imageData.ContentType
    }
  )
  res.writeHead(200, {
    'Content-Type': 'image/png' || imageData.ContentType,
    'Content-Length': imageData.Body.length
  })
  res
    .end(imageData.Body)
})