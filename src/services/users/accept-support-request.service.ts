import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';

export default class AcceptSupportRequestService {
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;

  constructor(userRepository: UserRepository, notificationRepository: NotificationRepository) {
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  public async handle(id: string, authUserId: string, notificationId: string) {
    const userToAccept = await this.userRepository.readOne(id);

    if (!userToAccept) {
      throw new ResponseError(400, 'User not found or not requested');
    }

    await this.userRepository.updateOne6(id, authUserId);

    await this.userRepository.updateOne2(id, authUserId);
    await this.notificationRepository.update(notificationId, {
      type: 'message',
      message: `${userToAccept.username} has supported you`,
      date: new Date(),
    });

    const updatedUser = await this.userRepository.findOne4(id);

    return updatedUser;
  }
}
