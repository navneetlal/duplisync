import {
  ObjectId,
  type Document,
  type Filter,
  type FindOptions,
  type DeleteOptions,
  type UpdateOptions,
} from 'mongodb'
import database from '../infra/database'

interface SynchronizationConfigDocument extends Document {
  source_database: string
  source_collection: string
  source_key: string
  destination_database: string
  destination_collection: string
  destination_key: string
  destination_field: string
  last_sync_time: Date
  source_last_updated_key: string
}

class SynchronizationConfig {
  constructor(private data: any) {}

  static async findById(id: string, options?: FindOptions): Promise<SynchronizationConfig | null> {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    const result = await collection.findOne({ _id: new ObjectId(id) }, options)
    return result ? new SynchronizationConfig(result) : null
  }

  static async findAll(filter: Filter<Document>, options?: FindOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    const result = await collection.find(filter, options).toArray()
    return result
  }

  static async updateById(id: string, update: any, options?: UpdateOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    return collection.updateOne({ _id: new ObjectId(id) }, { $set: update }, options)
  }

  static async updateAll(filter: Filter<Document>, update: any, options?: UpdateOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    return collection.updateMany(filter, { $set: update }, options)
  }

  static async deleteAll(filter: Filter<Document>, options?: DeleteOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    return collection.deleteMany(filter, options)
  }

  async save(options?: UpdateOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    return collection.updateOne(
      { _id: new ObjectId(this.data._id) },
      { $set: this.data },
      { upsert: true, ...options }
    )
  }

  async delete(options?: DeleteOptions) {
    const collection = database.getDb().collection<SynchronizationConfigDocument>('synchronization_config')
    return collection.deleteOne({ _id: new ObjectId(this.data._id) }, options)
  }

  get toObject(): any {
    return { ...this.data }
  }

  set merge(newData: any) {
    this.data = { ...this.data, ...newData }
  }
}

export default SynchronizationConfig
