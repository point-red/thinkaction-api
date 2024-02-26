import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class SupportAnotherUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const notificationRepository = new NotificationRepository();
    const userToSupport = await this.userRepository.findOne1(id, authUserId);

    if (id === authUserId) {
      throw new ResponseError(400, "Can't support current user");
    }

    const authUser = await this.userRepository.readOne(authUserId);
    if (!authUser) {
      throw new ResponseError(400, 'User is not found');
    }

    if (!userToSupport) {
      throw new ResponseError(400, 'User not found or already supported');
    }

    if (userToSupport.isPublic) {
      const notification = await notificationRepository.create({
        type: 'message',
        message: `${authUser.username} has supported you`,
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOne(id, authUserId, notificationId);

      await this.userRepository.updateOne2(id, authUserId);
    } else {
      const notification = await notificationRepository.create({
        type: 'request',
        message: `${authUser.username} wants to support you`,
        status: 'pending',
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOne3(id, authUserId, notificationId);
    }

    const updatedUser = await this.userRepository.findOne2(id);

    return updatedUser;
  }
}
