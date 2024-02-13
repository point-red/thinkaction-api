import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';

export default class GetOneNotificationService {
  private notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  public async handle(id: string) {
    const notification = await this.notificationRepository.readOne(id);

    if (!notification) {
      throw new ResponseError(400, 'Notification not found');
    }

    return notification;
  }
}
