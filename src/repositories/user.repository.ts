import Database from '../database/database';
import { DocInterface } from '../entities/docInterface';
import { ObjectId } from 'mongodb';

export class UserRepository extends Database {
  constructor() {
    super('users');
  }

  public async create(data: DocInterface) {
    return await this.collection.insertOne(data);
  }

  public async aggregate(pipeline: any) {
    return await this.collection.aggregate(pipeline).toArray();
  }

  public async readOne(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async findOne1(id: string, authUserId: string) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
      $and: [
        {
          supporter: { $ne: new ObjectId(authUserId) },
        },
        {
          request: { $ne: new ObjectId(authUserId) },
        },
      ],
    });
  }

  public async findOne2(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) }, { projection: { supporterCount: 1, isPublic: 1 } });
  }

  public async findOne3(id: string, authUserId: string) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
      supporter: new ObjectId(authUserId),
    });
  }

  public async findOneHistory(authUserId: string) {
    return await this.collection.findOne({
      id: new ObjectId(authUserId),
    }, {
      projection: { historyAccount: 1 }
    })
  }

  public async findOneRequest(id: string, authUserId: string) {
    return await this.collection.findOne({
      _id: new ObjectId(id),
      request: new ObjectId(authUserId),
    });
  }

  public async findOne4(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) }, { projection: { supportingCount: 1, isPublic: 1 } });
  }

  public async getUserByEmail(email: string) {
    return await this.collection.findOne({ email: email });
  }

  public async getUserByUsername(username: string) {
    return await this.collection.findOne({ username: username });
  }

  public async update(id: string, data: DocInterface) {
    return await this.collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      }
    );
  }

  public async updateRemoveHistory(id: string, authUserId: string) {
    return await this.collection.updateOne({ _id: new ObjectId(authUserId) }, { $pull: { historyAccount: new ObjectId(id) as any } });
  }

  public async updateOne(id: string, authUserId: string, notificationId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { supporter: new ObjectId(authUserId), notification: notificationId },
        $inc: { supporterCount: 1, notificationCount: 1 },
      }
    );
  }

  public async updateOne2(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(authUserId) },
      {
        $addToSet: { supporting: new ObjectId(id) },
        $inc: { supportingCount: 1 },
      }
    );
  }

  public async updateOne3(id: string, authUserId: string, notificationId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { request: new ObjectId(authUserId), notification: notificationId },
        $inc: { requestCount: 1, notificationCount: 1 },
      }
    );
  }

  public async updateOne4(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { supporter: new ObjectId(authUserId) } as any,
        $inc: { supporterCount: -1 },
      }
    );
  }

  public async updateOne5(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(authUserId) },
      {
        $pull: { supporting: new ObjectId(id) } as any,
        $inc: { supportingCount: -1 },
      }
    );
  }

  public async updateOneRemoveRequest(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { request: new ObjectId(authUserId) } as any,
        $inc: { requestCount: -1 },
      }
    );
  }

  public async updateOne6(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { supporter: new ObjectId(authUserId) },
        $pull: { request: new ObjectId(authUserId) } as any,
        $inc: { supporterCount: 1, requestCount: -1 },
      }
    );
  }

  public async updateOne7(id: string, authUserId: string) {
    return await this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { request: new ObjectId(authUserId) } as any,
        $inc: { requestCount: -1 },
      }
    );
  }

  public async updateOne8(id: string, authUserId: string) {
    return await this.collection.updateOne({ _id: new ObjectId(authUserId) }, {
      $push: { historyAccount: { $each: [new ObjectId(id)], $position: 0 } } as any
    });
  }

  public async updateOne9(authUserId: string) {
    return await this.collection.updateOne({ _id: new ObjectId(authUserId) }, { $set: { historyAccount: [] } });
  }

  public async updateOne10(id: string) {
    return await this.collection.updateOne({ notification: new ObjectId(id) },
      {
        $pull: { notification: new ObjectId(id) } as any,
        $inc: { notificationCount: -1 }
      }
    );
  }

  public async updateOne11(id: string, data: DocInterface) {
    return await this.collection.updateOne({ _id: new ObjectId(id) }, {
      $push: { categoryResolution: data } as any
    });
  }

  public async updateOne12(id: string, data: DocInterface) {
    if (data.name !== null) {
      return await this.collection.updateOne(
        {
          _id: new ObjectId(id),
          'categoryResolution._id': new ObjectId(data._id),
        },
        {
          $set: {
            'categoryResolution.$.name': data.name,
            'categoryResolution.$.resolution': data.resolution,
            'categoryResolution.$.isComplete': data.isComplete,
            'categoryResolution.$.createdDate': data.createdDate,
          },
        }
      );
    }
  }

  public async delete(id: string) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  public async deleteMany() {
    return await this.collection.deleteMany({});
  }
}
