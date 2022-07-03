
import { getItems, queryItems } from '@apsamuel/home-data'

// one day in milliseconds
const day = 1000 * 60 * 60 * 24

const average = (arr) => arr.reduce((a, b) => a+b, 0) / arr.length

export async function statisticsForWorkHistory(data) {
  // const results = []
  const globalTechnologiesUsed = []
  const results = {
    companyHistoryStats: [],
    companyRolesHeld: [],
    // companyTechnologies: [],
  }

  // global totals



  for (const workHistoryItem of data) {
    const itemResult = {}
    // use company ID to get role history for item
    const {companyId, companyName } = workHistoryItem
    itemResult['companyId'] = companyId;
    itemResult['companyName'] = companyName;
    const roleHistory = (await queryItems('roleHistory', 'roleHistoryIndex', {
      companyId
    })).Items

    // calculate elapsed time
    const { companyStartDate, companyEndDate } = workHistoryItem
    const elapsedTime = companyEndDate === 'current'
      ? new Date().getTime()
      : new Date(companyEndDate).getTime() -
    new Date(companyStartDate).getTime()
    itemResult['companyElapsedTimeServed'] = elapsedTime / day

    // add roles held at position

    itemResult['companyTotalRoles'] = roleHistory.length

    // get totals across roles, across positions
    for (const role of roleHistory) {
      if (!results.companyRolesHeld.includes(role.roleName)) {
        results.companyRolesHeld.push(role.roleName)
      }

      // for each technology pull in statistics accordingly
      for (const technology of role.roleTech) {
        if (!globalTechnologiesUsed.map((technology) => { return technology.roleTechName}).includes(role.roleTechName) ) {
         globalTechnologiesUsed.push(technology)
        }
      }

    }


    // process some `global` stats

    results.companyHistoryStats.push(itemResult)

    results[`companyTechStats`] = await summaryForRoleTech(globalTechnologiesUsed)
  }
  return results
}

export async function statisticsForRoleHistory(data) {
  const results = {
    roles: [],
    roleStatsRoleNames: [],
    roleStatsTechNames: [],
    roleStatsTechTypes: [],
    // roleStatsTechnology: {},
    roleSummaryTechnology: []
  }
  const allTechnologies = []
  for (const roleHistoryItem of data) {
    // const itemResult = {}
    const { companyId, companyName, roleName, roleId, roleStartDate, roleEndDate, roleTech } = roleHistoryItem
    const roleElapsedTime = roleEndDate === 'current'
      ? new Date().getTime()
      : new Date(roleEndDate).getTime() -
      new Date(roleStartDate).getTime()

    if (!results.roleStatsRoleNames.includes(roleName)) {
      results.roleStatsRoleNames.push(roleName)
    }

    const roleTechTotal = roleTech.length

    for (const tech of roleTech) {
      const type = tech.roleTechType;
      const name = tech.roleTechProvider === tech.roleTechName
        ? tech.roleTechName
        : `${tech.roleTechProvider} ${tech.roleTechName}`
      if (!results.roleStatsTechNames.includes(name)) {
        results.roleStatsTechNames.push(name)
      }

      if (!results.roleStatsTechTypes.includes(type)) {
        results.roleStatsTechTypes.push(type)
      }

      if (! allTechnologies.map((tech) => { return tech.roleTechName}).includes(name) ) {
        allTechnologies.push(tech)
      }
    }

    // console.log(allTechnologies)
    // results.roleStatsTechnology = await statisticsForRoleTech(allTechnologies)
    results.roleSummaryTechnology = await summaryForRoleTech(allTechnologies)
    // const roleTechStats = await statisticsForRoleTech(roleTech)

    const roleTechSummary = await summaryForRoleTech(roleTech)
    results.roles.push({
      roleId,
      roleName,
      roleStatsElapsedTime: roleElapsedTime / day,
      roleStatsTechTotal: roleTechTotal,
      roleTechSummary,
    })
  }

  return results
}

export async function statisticsForRoleTech(data) {
  const results = {}
  const techNames = data.map((tech) => {
    return tech.roleTechType
  })

  for (const techName of techNames) {
    results[techName] = 0
  }

  for (const roleTechnology of data) {
    const { roleTechType } = roleTechnology
    results[roleTechType] += 1
  }

  return results

}

export async function summaryForRoleTech(data) {
  let results = []

  for (const tech of data) {
    // add key to counts if doesn't exist and increment
    const name = tech.roleTechName === tech.roleTechProvider
      ? tech.roleTechName
      : `${tech.roleTechProvider} ${tech.roleTechName}`

    if (!results.map((r) => { return r.name }).includes(tech.roleTechType)) {
      results.push({
        name: tech.roleTechType,
        color: tech.roleTechColor,
        value: 1,
        usage: [
          name
        ]
      })
    } else {
      const index = results.map((r) => {return r.name }).indexOf(tech.roleTechType)

      // update the results item
      if (! results[index].usage.includes(name)) {
        results[index] = {
          ...results[index],
          value: (results[index].value += 1),
          usage: [...results[index].usage, name],
        };
      } else {
        results[index] = {
          ...results[index],
          value: (results[index].value += 1),
        };
      }




    }
    // if (!counts.hasOwnProperty(techType)) {
    //   counts[techType] = 1
    // }
    // counts[techType] += 1
  }
  return results
}
