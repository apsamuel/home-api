import {
  getItem,
  getItems,
  putItem,
  deleteItem
} from '../lib/Dynamo.js'

import { resumeWorkHistory } from '../lib/resumeWorkHistory.js'
import { randomUUID } from 'crypto'

const workHistoryItems = resumeWorkHistory()
const TableName = 'workHistory'

for (const workHistoryItem of workHistoryItems) {
  const companyId = randomUUID()
  const companyName = workHistoryItem.companyName
  const companyRoles = workHistoryItem.companyRoles.map(role => {
    const { roleStartDay, roleStartMonth, roleStartYear, roleEndDay, roleEndMonth, roleEndYear } = role
    const roleStartDate = `${roleStartYear}-${roleStartMonth}-${roleStartDay}`
    const isBool = (val) => val.constructor.name !== 'Number'

    const containsBooleans = [ roleEndDay, roleEndMonth, roleEndYear ].some(isBool)
    console.log(role.roleName + " contains bools? " + containsBooleans)
    // add IDs for roles within companies
    const roleId = randomUUID()
    return {
      roleId,
      ...role,
      roleStartDate,
      roleEndDate: containsBooleans ? 'current' : `${role.roleEndYear}-${role.roleEndMonth}-${role.roleEndDay}`,
    };
  })

  console.log({
    companyId,
    companyName,
    step: 'createRecord'
  });
  const Item = {
    companyId,
    ...workHistoryItem,
    companyRoles
  }
  const result = await putItem({
    TableName,
    Item
  })

  console.log({
    companyId,
    companyName,
    step: 'createdRecord',
    result
  })

}