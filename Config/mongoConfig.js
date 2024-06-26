const { MongoClient} = require('mongodb')
require('dotenv').config()
// const username = process.env.MONGO_USERNAME
// const password = process.env.MONGO_PASSWORD
const hostname = process.env.MONGO_HOSTNAME 
const port = process.env.MONGO_PORT 
const dbName = process.env.MONGO_DBNAME

const uri = `mongodb://${hostname}:${port}/${dbName}`

let client;

async function connectToDB() {
  try {
    if (!client) {
      client = new MongoClient(uri, { useUnifiedTopology: true })

      await client.connect()
      const db = client.db(dbName)
      console.log('db connected');
      return db
    }
    return client.db(dbName)
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    throw error
  }
}

module.exports = connectToDB
 