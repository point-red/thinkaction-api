import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';

export default class DeleteNotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public async handle(id: string) {
    const notification = await this.notificationRepository.readOne(id);

    if (!notification) {
      throw new ResponseError(404, 'notification is not found');
    }

    await this.notificationRepository.delete(id);

    const userRepository = new UserRepository();

    return await userRepository.updateOne10(id);
  }
}
