import { ObjectId } from 'mongodb';
import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';

export default class UnsupportAnotherUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {

    // get requested support
    const userRequest = await this.userRepository.findOneRequest(id, authUserId);
    let type = 'support';

    // Remove one notification if the user supports before or requested before.
    const notificationRepository = new NotificationRepository();
    const notification = await notificationRepository.findOne({
      fromUserId: new ObjectId(authUserId),
      toUserId: new ObjectId(id),
    });

    if (notification?._id) {
      const id = notification?._id.toString();
      await notificationRepository.delete(id);
      await this.userRepository.updateOne10(id);
    }

    if (userRequest) {
      type = 'request';
      await this.userRepository.updateOneRemoveRequest(id, authUserId);
    } else {
      const userToUnsupport = await this.userRepository.findOne3(id, authUserId);

      if (!userToUnsupport) {
        throw new ResponseError(400, 'User not found or not supported');
      }

      await this.userRepository.updateOne4(id, authUserId);

      await this.userRepository.updateOne5(id, authUserId);
    }

    const updatedUser = await this.userRepository.findOne2(id);

    if (updatedUser) {
      updatedUser.type = type
    }

    return updatedUser;
  }
}
