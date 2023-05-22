import { MongoClient, Db } from 'mongodb'
import logger from '../logger/logger'

class Database {
  private client?: MongoClient
  private db?: Db
  private readonly dbName: string = process.env.DB_NAME ?? 'duplisync'

  constructor(private uri: string) {}

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(this.uri)
      await this.client.connect()
      this.db = this.client.db(this.dbName)
      logger.info('Connected to MongoDB')
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      logger.info('Disconnected from MongoDB')
    }
  }

  getClient(): MongoClient {
    if (!this.client) {
      throw new Error('Database not connected')
    }
    return this.client
  }
}

const mongoConnectionString = process.env.MONGO_CONNECTION_URL ?? 'mongodb://localhost:27017'
const database = new Database(mongoConnectionString)

export default database
