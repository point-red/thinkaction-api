import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetHistoryService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(authUserId: string) {
    const pipeline = [
      {
        '$match': {
          '_id': new ObjectId(authUserId),
          "historyAccount": {
            $exists: 1
          }
        }
      }, {
        '$project': {
          'historyAccount': {
            '$slice': [
              '$historyAccount', 7
            ]
          },
          'supporting': 1
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'historyAccount',
          'foreignField': '_id',
          'as': 'unsortedAccounts'
        }
      }, {
        '$addFields': {
          'accounts': {
            '$map': {
              'input': '$historyAccount',
              'as': 'id',
              'in': {
                '$arrayElemAt': [
                  {
                    '$filter': {
                      'input': '$unsortedAccounts',
                      'as': 'detail',
                      'cond': {
                        '$eq': [
                          '$$detail._id', '$$id'
                        ]
                      }
                    }
                  }, 0
                ]
              }
            }
          }
        }
      }, {
        '$addFields': {
          'accounts': {
            'currentSupporting': '$supporting'
          }
        }
      }, {
        '$unwind': {
          'path': '$accounts'
        }
      }, {
        '$replaceRoot': {
          'newRoot': '$accounts'
        }
      }, {
        '$addFields': {
          'mutualSupporter': {
            '$filter': {
              'input': '$supporter',
              'as': 'id',
              'cond': {
                '$in': [
                  '$$id', '$currentSupporting'
                ]
              }
            }
          }
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'mutualSupporter',
          'foreignField': '_id',
          'as': 'supportedBy'
        }
      }, {
        '$project': {
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

    const result = (await this.userRepository.aggregate(pipeline));

    if (!result?.[0]?._id) {
      return [];
    }

    return result;
  }
}
