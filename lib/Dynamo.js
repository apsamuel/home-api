import AWS from 'aws-sdk'
// import { filterList } from './Commons.js'

const dynamodb = new AWS.DynamoDB()
const docClient = new AWS.DynamoDB.DocumentClient()

/**
 * getItems
 * @param {String} tableName - the table name to get items from
 * @example
 * const tableName = 'this'
 * const items = await getItems(tableName)
 * items.length
 * @returns {Array<Object>} - a list of items, or an empty list
 */
export async function getItems(tableName) {
  const params = {
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    docClient.scan(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data.Items)
    })
  })

}

/**
 * putItem
 * @param {Object} params - an object with TableName: String and Item: Object representing the item to put within Dynamo
 * @example
 * TableName = 'this'
 * Item = { foo: 'bar' }
 * params = { TableName, Item }
 * await putItem(params)
 * @returns
 */
export async function putItem(params) {
  params = {
    ...params,
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE',
  };
  return new Promise((resolve, reject) => {
    docClient.put(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

/**
 *
 * @param {String} tableName the name of the table
 * @param {Object} params - an object containing the {'primaryKeyName': 'primaryKeyValue'} for the call to get
 * @example
 * const tableName = 'this'
 * const params = {companyId: 'value'}
 * const item = await getItem(tableName, params)
 * @returns an object representing the dynamodb record if it exists
 */
export async function getItem(tableName, params) {
  // if (!params.tableName)
  const TableName = tableName
  const Key = params
  params = {
    TableName,
    Key
  }
  return new Promise((resolve, reject) => {
    docClient.get(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data.Item)
    })
  })
}
export async function deleteItem(tableName, primaryKeyName, itemId) {
  const TableName = tableName
  const Key = {
    [primaryKeyName]: itemId
  }
  const params = {
    TableName,
    Key
  }
  return new Promise((resolve, reject) => {
    docClient.delete(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

export async function updateItem(tableName, keyParams, updateParams) {
  const TableName = tableName
  const Key = {
    ...keyParams
  }
  const UpdateExpressions = []
  const ExpressionAttributeValues = {}
  const ReturnValues = 'UPDATED_NEW'

  //  keys present in updateParams object
  const attributes = Object.keys(updateParams)
  // for each key
  for (const attribute of attributes) {
   // build query
   UpdateExpressions.push( `set ${attribute} = :${attribute}` )
   // add the value
   ExpressionAttributeValues[`:${attribute}`] = updateParams[attribute]
  }
  const params = {
    TableName,
    Key,
    UpdateExpression: UpdateExpressions.join(','),
    ExpressionAttributeValues,
    ReturnValues

  }
  return new Promise((resolve, reject) => {
    docClient.update(params, function(err, data) {
      if (err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}