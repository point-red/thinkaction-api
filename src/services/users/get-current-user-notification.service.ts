import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetCurrentUserNotificationService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(authUserId: string) {
    const user: any = await this.userRepository.readOne(authUserId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const pipeline = [
      { $match: { _id: { $in: user.notification.map((id: any) => new ObjectId(id)) } } },
      { $limit: 20 },
      {
        $addFields: {
          category: {
            $switch: {
              branches: [
                { case: { $gte: ['$date', today] }, then: 'today' },
                { case: { $gte: ['$date', yesterday] }, then: 'yesterday' },
                { case: { $gte: ['$date', thisWeek] }, then: 'thisWeek' },
                { case: { $gte: ['$date', thisMonth] }, then: 'thisMonth' },
              ],
              default: 'older',
            },
          },
        },
      },
      {
        $group: {
          _id: '$category',
          notifications: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          category: '$_id',
          notifications: 1,
        },
      },
    ];

    const notificationRepository = new NotificationRepository();
    const categorizedNotifications = await notificationRepository.aggregate(pipeline);

    const data = categorizedNotifications.reduce((acc, curr) => {
      acc[curr._id] = curr.notifications;
      return acc;
    }, {});

    return data;
  }
}
