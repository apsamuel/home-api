
import { getItems, queryItems } from '@apsamuel/home-data'

// one day in milliseconds
const day = 1000 * 60 * 60 * 24

const average = (arr) => arr.reduce((a, b) => a+b, 0) / arr.length

export async function statisticsForWorkHistory(data) {
  const results = []

  for (const workHistoryItem of data) {
    const itemResult = {}

    // get role records for companyId

    const {companyId, companyName } = workHistoryItem
    const roleHistory = (await queryItems('roleHistory', 'roleHistoryIndex', {
      companyId
    })).Items
    const { companyStartDate, companyEndDate } = workHistoryItem
    const elapsedTime = companyEndDate === 'current'
      ? new Date().getTime()
      : new Date(companyEndDate).getTime() -
    new Date(companyStartDate).getTime()
    itemResult['companyElapsedTimeServed'] = elapsedTime / day
    itemResult['companyId'] = companyId
    itemResult['companyName'] = companyName
    itemResult['companyTotalRoles'] = roleHistory.length

    // parse the role history and return an object for the statistics
    const parseRoleHistory = await statisticsForRoleHistory(roleHistory)
    itemResult['roleBasedStatistics'] = parseRoleHistory

    results.push(itemResult)
  }
  return results
}

export async function statisticsForRoleHistory(data) {
  const results = {
    roles: [],
    roleStatsTechNames: [],
    roleStatsTechTypes: [],
    roleStatsTechnology: {}
  }
  const allTechnologies = []
  for (const roleHistoryItem of data) {
    // const itemResult = {}
    const { companyId, companyName, roleName, roleId, roleStartDate, roleEndDate, roleTech } = roleHistoryItem
    const roleElapsedTime = roleEndDate === 'current'
      ? new Date().getTime()
      : new Date(roleEndDate).getTime() -
      new Date(roleStartDate).getTime()


    const roleTechTotal = roleTech.length
    // results.roleTechNames = [
    //   ...results.roleTechNames,
    //   roleTech.map((tech) => {

    //     return `${tech.roleTechProvider} ${tech.roleTechName}`
    //   })
    // ]
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
    results.roleStatsTechnology = await statisticsForRoleTech(allTechnologies)
    const roleTechStats = await statisticsForRoleTech(roleTech)
    results.roles.push({
      roleId,
      roleName,
      roleStatsElapsedTime: roleElapsedTime / day,
      roleStatsTechTotal: roleTechTotal,
      roleStatsTech: roleTechStats
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
