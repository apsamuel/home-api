import {
  getItem,
  getItems,
  putItem,
  deleteItem
} from '../lib/Dynamo.js';

const TableName = 'workHistory'
const workHistoryItems = await getItems({ TableName })

console.log(JSON.stringify(workHistoryItems, null, 2))