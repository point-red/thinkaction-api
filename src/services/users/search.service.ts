import { ObjectId } from 'mongodb';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class SearchUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(username: string, authUserId: string) {
    const authUser: any = await this.userRepository.readOne(authUserId);

    const supportingIds = authUser.supporting;
    const regex = { $regex: new RegExp('.*' + username + '.*', 'i') };

    const pipeline = [
      {
        $match: {
          $or: [{ username: regex }, { fullname: regex }],
        },
      },
      {
        $limit: 5,
      },
      {
        $addFields: {
          'currentUserId': new ObjectId(authUserId)
        }
      },
      {
        $lookup: {
          'from': 'users',
          'localField': 'currentUserId',
          'foreignField': '_id',
          'as': 'currentUser'
        }
      }, {
        $unwind: {
          'path': '$currentUser'
        }
      }, {
        $addFields: {
          'mutualSupporter': {
            '$filter': {
              'input': '$supporter',
              'as': 'id',
              'cond': {
                '$in': [
                  '$$id', '$currentUser.supporting'
                ]
              }
            }
          }
        }
      }, {
        $lookup: {
          'from': 'users',
          'localField': 'mutualSupporter',
          'foreignField': '_id',
          'as': 'supportedBy'
        }
      }, {
        $project: {
          '_id': 1,
          'fullname': 1,
          'username': 1,
          'photo': 1,
          'supportedByCount': 1,
          'supportedBy': {
            '_id': 1,
            'fullname': 1,
            'username': 1
          }
        }
      }
    ];

    const data = await this.userRepository.aggregate(pipeline);
    // await this.userRepository.updateOne8(data, authUserId);
    return data;
  }
}
