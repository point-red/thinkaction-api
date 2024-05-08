import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';

export default class RejectSupportRequestService {
  private userRepository: UserRepository;
  private notificationRepository: NotificationRepository;

  constructor(userRepository: UserRepository, notificationRepository: NotificationRepository) {
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
  }

  public async handle(id: string, authUserId: string) {
    const userToReject = await this.userRepository.readOne(id);

    if (!userToReject) {
      throw new ResponseError(400, 'User not found or not requested');
    }

    await this.userRepository.updateOne7(id, authUserId);

    const updatedUser = await this.userRepository.findOne4(id);

    return updatedUser;
  }
}
