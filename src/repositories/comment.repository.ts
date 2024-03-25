import Database from '../database/database';
import { DocInterface } from '../entities/docInterface';
import { ObjectId } from 'mongodb';

export class CommentRepository extends Database {
  constructor() {
    super('comments');
  }

  public async create(data: DocInterface) {
    return await this.collection.insertOne(data);
  }

  public async readOne(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async update(id: string, data: ObjectId) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { reply: data } as any,
        $inc: { replyCount: 1 },
      }
    );
  }

  public async update2(id: string, data: DocInterface) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: data,
      }
    );
  }

  public async update3(id: string, data: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { reply: new ObjectId(data) } as any,
        $inc: { replyCount: -1 },
      }
    );
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
