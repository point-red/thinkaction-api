import { CommentEntity } from '../../entities/comments.entity';
import { CommentRepository } from '../../repositories/comment.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import { PostRepository } from '../../repositories/post.repository';
import { NotificationRepository } from '../../repositories/notification.repository';

export default class CreateCommentService {
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

    const authUser = await this.userRepository.readOne(id);
    const post = await this.postRepository.readOne(data.postId);

    if (!authUser || !post) {
      throw new ResponseError(404, "Post or User not found");
    }
    const commentEntity = new CommentEntity({
      userId: new ObjectId(id),
      postId: new ObjectId(data.postId),
      message: data.message,
      reply: [],
      replyCount: 0,
      type: 'comment',
      createdDate: new Date(),
      isUpdating: data.isUpdating || false,
    });

    let commentData = commentEntity.CheckData();

    let comment = await this.commentRepository.create(commentData);

    await this.postRepository.addCommentCount(data.postId);

    const dataComment = await this.commentRepository.readOne(comment.insertedId.toString());
    if (!dataComment) {
      throw new ResponseError(404, 'Comment not found');
    }


    // Handle Notifications:
    if (post.userId.toString() !== id && comment.insertedId) {
      const notification = await this.notificationRepository.create({
        type: 'comment',
        toUserId: post.userId,
        commentId: comment.insertedId,
        commentExcerpt: data.message.substring(0, 32),
        toPostId: post._id,
        fromUserId: authUser._id,
        message: `${authUser.username} commented your post`,
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOneNotify(notificationId, post.userId.toString());
    }

    return {
      _id: dataComment._id,
      postId: dataComment.postId,
      userId: dataComment.userId,
      userInfo: {
        _id: id,
        username: authUser.username,
        photo: authUser.photo,
      },
      message: dataComment.message,
      type: dataComment.type,
      replyCount: dataComment.replyCount,
      createdDate: dataComment.createdDate.toISOString(),
      updatedDate: dataComment.updatedDate ? dataComment.updatedDate.toISOString() : null,
    };
  }
}
