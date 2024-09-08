import Database from '../database/database';
import { DocInterface } from '../entities/docInterface';
import { ObjectId } from 'mongodb';

export class PostRepository extends Database {
  constructor() {
    super('posts');
  }

  public async create(data: DocInterface) {
    return await this.collection.insertOne(data);
  }

  public async readOne(id: string) {
    return await this.collection.findOne({
      $or: [
        { _id: new ObjectId(id), },
        { categoryResolutionId: new ObjectId(id), }
      ]
    });
  }

  public async update(id: string, data: DocInterface) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  }

  public async update2(id: string, authUserId: string) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, { $push: { like: new ObjectId(authUserId) } as any, $inc: { likeCount: 1 } });
  }

  public async addCommentCount(id: string) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, { $inc: { commentCount: 1 } });
  }

  public async deleteCommentCount(id: string) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, { $dec: { commentCount: 1 } });
  }

  public async update3(id: string, authUserId: string) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, { $pull: { like: new ObjectId(authUserId) } as any, $inc: { likeCount: -1 } });
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
