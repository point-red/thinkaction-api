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
          message: '$notificationData.message',
          date: '$notificationData.date',
          status: '$notificationData.status',
        },
      },
      { $limit: 10 },
    ];

    const data = await this.userRepository.aggregate(pipeline);

    return data;
  }
}
