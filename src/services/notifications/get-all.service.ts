import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetAllNotificationService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string) {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      { $unwind: '$notification' },
      {
        $lookup: {
          from: 'notifications',
          localField: 'notification',
          foreignField: '_id',
          as: 'notificationData',
        },
      },
      { $unwind: '$notificationData' },
      {
        $project: {
          _id: '$notificationData._id',
          type: '$notificationData.type',
          fromUserId: '$notificationData.fromUserId',
          message: '$notificationData.message',
          date: '$notificationData.date',
          status: '$notificationData.status',
        },
      },
      {
        $lookup: {
            from: 'users',
            localField: 'fromUserId',
            foreignField: '_id',
            as: 'fromUser'
        }
      }, 
      {
        $unwind: {
          path: '$fromUser',
        }
      }, 
      {
        $addFields: {
            'fromUser.isSupporting': {
                $in: [new ObjectId(id), '$fromUser.supporter']
            }
        }
      },
      {
        $project: {
          _id: 1,
          date: 1,
          type: 1,
          message: 1,
          fromUserId: 1,
          status: 1,
          fromUser: {
            id: 1,
            username: 1,
            photo: 1,
            isSupporting: 1,
            isPublic: 1,
          },
        }
      },
      { $limit: 10 },
    ];
    const data = await this.userRepository.aggregate(pipeline);

    return data;
  }
}
