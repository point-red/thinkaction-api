import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class LikePostService {
  private postRepository: PostRepository;
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, notificationRepository: NotificationRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const statusLike: any = await this.postRepository.readOne(data.postId);

    const alreadyLike = statusLike.like.find((like: any) => like.toString() == authUserId);
    const authUser = await this.userRepository.readOne(authUserId);

    if (!authUser) {
      throw new ResponseError(400, 'Auth User not found');
    }
    if (alreadyLike) {
      throw new ResponseError(400, 'You already like');
    }
    await this.postRepository.update2(data.postId, authUserId);

    let post: any = await this.postRepository.readOne(data.postId);

    // Handle Notifications:
    if (statusLike.userId.toString() !== authUserId) {
      const notification = await this.notificationRepository.create({
        type: 'like',
        toUserId: statusLike.userId,
        toPostId: statusLike._id,
        fromUserId: authUser._id,
        message: `${authUser.username} liked your post`,
        date: new Date(),
      });

      const notificationId: any = notification.insertedId;

      await this.userRepository.updateOneNotify(notificationId, statusLike.userId);
    }

    return {
      _id: data.postId,
      likeCount: post.likeCount,
      likedByCurrent: true,
    };
  }
}
