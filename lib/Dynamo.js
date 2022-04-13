import AWS from 'aws-sdk'

// AWS.config.apiVersions = {
//   dynamodb: '2011-12-05',
// };



const dynamodb = new AWS.DynamoDB()
const docClient = new AWS.DynamoDB.DocumentClient()

export async function getItems(params) {
  // let records = []
  return new Promise((resolve, reject) => {
    const request = dynamodb.scan(params);
    const promise = request.promise();
    promise.then(
      function (data) {
        return resolve(data.Items)
      },
      function (error) {
        const { code, time, requestId, statusCode, retryable, retryDelay } = error
        return reject({
          code,
          time,
          requestId,
          statusCode,
          retryable,
          retryDelay
        })
      }
    );
  })
}

export async function putItem(params) {
  params = {
    ...params,
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE',
    // ReturnValues: 'NONE'
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

export async function getItem(params) {
  params = {
    ...params
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

export async function updateItem(params) {}