import Database from '../database/database';
import { DocInterface } from '../entities/docInterface';
import { ObjectId } from 'mongodb';

export class NotificationRepository extends Database {
  constructor() {
    super('notifications');
  }

  public async create(data: DocInterface) {
    return await this.collection.insertOne(data);
  }

  public async readOne(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async aggregate(pipeline: any) {
    return await this.collection.aggregate(pipeline).toArray();
  }

  public async delete(id: string) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  public async deleteMany() {
    return await this.collection.deleteMany({});
  }
}
