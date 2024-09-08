import { CommentEntity } from '../../entities/comments.entity';
import { CommentRepository } from '../../repositories/comment.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import { PostRepository } from '../../repositories/post.repository';
import { NotificationRepository } from '../../repositories/notification.repository';

export default class CreateReplyCommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor(commentRepository: CommentRepository, postRepository: PostRepository, notificationRepository: NotificationRepository, userRepository: UserRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  public async handle(data: DocInterface, id: string) {
    const post = await this.postRepository.readOne(data.postId);

    if (!post) {
      throw new ResponseError(404, 'Post not found');
    }

    const commentEntity = new CommentEntity({
      _id: new ObjectId(),
      userId: new ObjectId(id),
      postId: new ObjectId(data.postId),
      message: data.message,
      reply: [],
      replyCount: 0,
      type: 'reply',
      createdDate: new Date(),
      isUpdating: data.isUpdating || false,
    });

    await this.postRepository.addCommentCount(data.postId);

    let commentData: any = commentEntity.CheckData();

    let comment = await this.commentRepository.update(data.replyTo, commentData._id);

    const replyComment = await this.commentRepository.create(commentData);

    const dataComment = await this.commentRepository.readOne(data.replyTo);

    if (!dataComment) {
      throw new ResponseError(404, 'Comment not found');
    }

    let dataReply = dataComment.reply.find((reply: any) => reply.toString() === commentData._id.toString());

    dataReply = await this.commentRepository.readOne(dataReply);

    const userRepository = this.userRepository;
    const userDataReply = await userRepository.readOne(id);
    const userDataParentComment = await userRepository.readOne(dataComment.userId);

    if (!userDataReply) {
      throw new ResponseError(404, 'User reply not found');
    }

    if (!userDataParentComment) {
      throw new ResponseError(404, 'User parent comment not found');
    }

    // Handle Notifications for post owner:
    if (userDataReply._id.toString() !== post.userId.toString() && replyComment.insertedId) {
      const notification = await this.notificationRepository.create({
        type: 'comment',
        toUserId: post.userId,
        commentId: replyComment.insertedId,
        commentExcerpt: data.message.substring(0, 32),
        toPostId: post._id,
        fromUserId: userDataReply._id,
        message: `${userDataReply.username} replied a comment your post`,
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOneNotify(notificationId, post.userId.toString());
    }

    // Handle Notifications for parent comment:
    if (userDataReply._id.toString() !== userDataParentComment._id.toString() && replyComment.insertedId) {
      const notification = await this.notificationRepository.create({
        type: 'reply',
        toUserId: userDataParentComment._id,
        toCommentId: comment.upsertedId,
        fromCommentId: replyComment.insertedId,
        commentExcerpt: data.message.substring(0, 32),
        toPostId: post._id,
        fromUserId: userDataReply._id,
        message: `${userDataReply.username} replied on your comment`,
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOneNotify(notificationId, userDataParentComment._id.toString());
    }

    return {
      comment: {
        _id: dataReply._id,
        postId: dataReply.postId,
        userId: dataReply.userId,
        userInfo: {
          _id: dataReply.userId,
          username: userDataReply.username,
          fullname: userDataReply.fullname,
          photo: userDataReply.photo,
        },
        message: dataReply.message,
        type: dataReply.type,
        replyCount: dataReply.replyCount,
        createdDate: dataReply.createdDate,
        updatedDate: dataReply.updatedDate,
      },
      parentComment: {
        _id: dataComment._id,
        postId: dataComment.postId,
        userId: dataComment.userId,
        userInfo: {
          _id: dataComment.userId,
          username: userDataParentComment.username,
          fullname: userDataParentComment.fullname,
          photo: userDataParentComment.photo,
        },
        message: dataComment.message,
        type: dataComment.type,
        replyCount: dataComment.replyCount,
        createdDate: dataComment.createdDate,
        updatedDate: dataComment.updatedDate,
      },
    };
  }
}
