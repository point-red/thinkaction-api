import { ObjectId } from 'mongodb';
import { ResponseError2 } from '../middleware/error.middleware';

export interface NotificationInterface {
  _id?: string | ObjectId;
  type?: 'request' | 'message';
  message?: string;
  status?: 'accepted' | 'rejected' | 'pending';
  date?: Date;
}

export class NotificationEntity {
  private notification: NotificationInterface;

  constructor(notification: NotificationInterface) {
    this.notification = {
      _id: notification._id,
      type: notification.type,
      message: notification.message,
      status: notification.status,
      date: notification.date,
    };
  }

  checkData() {
    const errors: { [key: string]: string } = {};

    if (!this.notification.type) {
      errors.type = 'Notification type is required.';
    } else if (!['request', 'message'].includes(this.notification.type)) {
      errors.type = 'Notification type must be either "request" or "message".';
    }

    if (!this.notification.message) {
      errors.message = 'Notification message is required.';
    } else if (typeof this.notification.message !== 'string') {
      errors.message = 'Notification message must be a string.';
    }

    if (this.notification.status && !['accepted', 'rejected', 'pending'].includes(this.notification.status)) {
      errors.status = 'Notification status must be either "accepted", "rejected", or "pending".';
    }

    if (this.notification.date && !(this.notification.date instanceof Date)) {
      errors.date = 'Notification date must be a Date object.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ResponseError2(400, JSON.stringify(errors));
    }

    return {
      _id: this.notification._id,
      type: this.notification.type,
      message: this.notification.message,
      status: this.notification.status,
      date: this.notification.date,
    };
  }
}
