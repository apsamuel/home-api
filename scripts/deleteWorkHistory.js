import { getItem, getItems, putItem, deleteItem } from '../lib/Dynamo.js';


const TableName = 'workHistory';
const workHistoryItems = await getItems({ TableName });

for (const workHistoryItem of workHistoryItems) {
  const companyId = workHistoryItem.companyId.S
  const companyName = workHistoryItem.companyName.S
  console.log({
    step: 'deleteItem',
    companyId,
    companyName
  })
  const result = await deleteItem('workHistory', 'companyId', companyId)
  console.log({
    step: 'itemDeleted',
    result
  })
}