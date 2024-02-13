import { ObjectId } from 'mongodb';
import { ResponseError2 } from '../middleware/error.middleware';

export interface CommentInterface {
  _id?: ObjectId;
  userId: string | ObjectId;
  postId: string | ObjectId;
  message: string;
  reply?: Array<string> | string;
  replyCount: number;
  type?: 'comment' | 'reply';
  updatedDate?: Date;
  createdDate?: Date;
  isUpdating?: boolean;
}

export class CommentEntity {
  private comment: CommentInterface;

  constructor(comment: CommentInterface) {
    this.comment = {
      _id: comment._id,
      userId: comment.userId,
      postId: comment.postId,
      message: comment.message,
      reply: comment.reply,
      replyCount: comment.replyCount,
      type: comment.type,
      updatedDate: comment.updatedDate,
      createdDate: comment.createdDate,
      isUpdating: comment.isUpdating || false,
    };
  }

  CheckData() {
    const errors: { [key: string]: string } = {};

    if (!this.comment.userId) {
      errors.message = 'User ID is required.';
    } else if (!(this.comment.userId instanceof ObjectId)) {
      errors.message = 'User ID must be a Object Id';
    }

    if (!this.comment.postId) {
      errors.message = 'Post ID is required.';
    } else if (!(this.comment.postId instanceof ObjectId)) {
      errors.message = 'Post ID must be a Object ID';
    }

    if (!this.comment.message) {
      errors.message = 'Message is required.';
    } else if (typeof this.comment.message !== 'string') {
      errors.message = 'Message must be a string.';
    }

    if (this.comment.reply && !(Array.isArray(this.comment.reply) || typeof this.comment.reply === 'string')) {
      errors.reply = 'Reply must be an array of strings or a string.';
    }

    if (typeof this.comment.replyCount !== 'number') {
      errors.replyCount = 'ReplyCount must be a number.';
    }

    if (this.comment.type && !['comment', 'reply'].includes(this.comment.type)) {
      errors.type = 'Type must be either "comment" or "reply".';
    }

    if (this.comment.updatedDate && !(this.comment.updatedDate instanceof Date)) {
      errors.updatedDate = 'UpdatedDate must be a Date object.';
    }

    if (this.comment.isUpdating && typeof this.comment.isUpdating !== 'boolean') {
      errors.isUpdating = 'IsUpdating must be a boolean.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ResponseError2(400, JSON.stringify(errors));
    }

    return {
      _id: this.comment._id,
      userId: this.comment.userId,
      postId: this.comment.postId,
      message: this.comment.message,
      reply: this.comment.reply,
      replyCount: this.comment.replyCount,
      type: this.comment.type,
      updatedDate: this.comment.updatedDate,
      createdDate: this.comment.createdDate,
      isUpdating: this.comment.isUpdating,
    };
  }
}
