import { ResponseError2 } from '../middleware/error.middleware';

interface CategoryResolutionInterface {
  _id?: string;
  name?: string;
  resolution?: string;
  isComplete?: boolean;
  createdDate?: Date;
}

export interface UserInterface {
  _id?: string;
  username: string;
  email: string;
  password: string;
  fullname?: string;
  bio?: string;
  photo?: Buffer;
  supporter?: Array<string> | string;
  supporting?: Array<string> | string;
  request?: Array<string> | string;
  notification?: Array<string> | string;
  goalsPerformance?: number;
  supporterCount?: number;
  supportingCount?: number;
  requestCount?: number;
  notificationCount?: number;
  categoryResolution?: Array<CategoryResolutionInterface>;
  historyAccount?: Array<string>;
  isPublic?: boolean;
  isUpdating?: boolean;
}

export class UserEntity {
  private user: UserInterface;

  constructor(user: UserInterface) {
    this.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      fullname: user.fullname,
      bio: user.bio,
      photo: user.photo,
      supporter: user.supporter,
      supporting: user.supporting,
      request: user.request,
      notification: user.notification,
      goalsPerformance: user.goalsPerformance,
      supporterCount: user.supporterCount,
      supportingCount: user.supportingCount,
      requestCount: user.requestCount,
      notificationCount: user.notificationCount,
      historyAccount: user.historyAccount,
      categoryResolution: user.categoryResolution,
      isPublic: user.isPublic,
      isUpdating: user.isUpdating || false,
    };
  }

  CheckData() {
    const errors: { [key: string]: string } = {};

    if (this.user._id && typeof this.user._id !== 'string') {
      errors._id = 'ID must be a string.';
    }

    if (!this.user.username) {
      errors.username = 'Username is required.';
    } else if (typeof this.user.username !== 'string') {
      errors.username = 'Username must be a string.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.user.email) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(this.user.email)) {
      errors.email = 'Invalid email format';
    }

    if (!this.user.password) {
      errors.password = 'Password is required.';
    } else if (typeof this.user.password !== 'string') {
      errors.password = 'Password must be a string.';
    }

    if (this.user.fullname && typeof this.user.fullname !== 'string') {
      errors.fullname = 'Fullname must be a string.';
    }

    if (this.user.bio && typeof this.user.bio !== 'string') {
      errors.bio = 'Bio must be a string.';
    }

    if (this.user.photo && typeof this.user.photo !== 'string' && this.user.photo !== null) {
      errors.photo = 'Photo must be a string or null.';
    }

    if (this.user.supporter && !(Array.isArray(this.user.supporter) || typeof this.user.supporter === 'string')) {
      errors.supporter = 'Supporter must be an array of strings or a string.';
    }

    if (this.user.supporting && !(Array.isArray(this.user.supporting) || typeof this.user.supporting === 'string')) {
      errors.supporting = 'Supporting must be an array of strings or a string.';
    }

    if (this.user.request && !(Array.isArray(this.user.request) || typeof this.user.request === 'string')) {
      errors.request = 'Request must be an array of strings or a string.';
    }

    if (this.user.notification && !(Array.isArray(this.user.notification) || typeof this.user.notification === 'string')) {
      errors.notification = 'Notification must be an array of strings or a string.';
    }

    if (this.user.goalsPerformance && typeof this.user.goalsPerformance !== 'number') {
      errors.goalsPerformance = 'GoalsPerformance must be a number.';
    }

    if (this.user.supporterCount && typeof this.user.supporterCount !== 'number') {
      errors.supporterCount = 'SupporterCount must be a number.';
    }

    if (this.user.supportingCount && typeof this.user.supportingCount !== 'number') {
      errors.supportingCount = 'SupportingCount must be a number.';
    }

    if (this.user.requestCount && typeof this.user.requestCount !== 'number') {
      errors.requestCount = 'RequestCount must be a number.';
    }

    if (this.user.notificationCount && typeof this.user.notificationCount !== 'number') {
      errors.notificationCount = 'NotificationCount must be a number.';
    }

    if (this.user.isPublic && typeof this.user.isPublic !== 'boolean') {
      errors.isPublic = 'IsPublic must be a boolean.';
    }

    if (this.user.isUpdating && typeof this.user.isUpdating !== 'boolean') {
      errors.isUpdating = 'IsUpdating must be a boolean.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ResponseError2(400, JSON.stringify(errors));
    }

    return {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      fullname: this.user.fullname,
      bio: this.user.bio,
      photo: this.user.photo,
      supporter: this.user.supporter,
      supporting: this.user.supporting,
      request: this.user.request,
      notification: this.user.notification,
      supporterCount: this.user.supporterCount,
      supportingCount: this.user.supportingCount,
      requestCount: this.user.requestCount,
      categoryResolution: this.user.categoryResolution,
      notificationCount: this.user.notificationCount,
      isPublic: this.user.isPublic,
      isUpdating: this.user.isUpdating,
    };
  }
}
