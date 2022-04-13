import {
  getItem,
  getItems,
  putItem,
  deleteItem
} from '../lib/Dynamo.js'

// import { workHistory } from './workHistory.js'
import { workHistory } from '../lib/workHistory.js'
import { randomUUID } from 'crypto'

const resumeWorkHistory = workHistory()
const TableName = 'workHistory'

for (const workHistoryItem of resumeWorkHistory) {
  const companyId = randomUUID()
  const companyName = workHistoryItem.companyName
  const companyRoles = workHistoryItem.companyRoles.map(role => {
    return {
      ...role,
      roleStartDate: `${role.roleStartYear}-${role.roleStartMonth}-${role.roleStartDay}`,
      roleEndDate: `${role.roleEndYear}-${role.roleEndMonth}-${role.roleEndDay}`,
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
// console.log(workHistory())