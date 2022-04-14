import { getItem, getItems, putItem, deleteItem } from '../lib/Dynamo.js';


const tableName = 'workHistory';
const workHistoryItems = await getItems( tableName );

for (const workHistoryItem of workHistoryItems) {
  const companyId = workHistoryItem.companyId
  const companyName = workHistoryItem.companyName
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