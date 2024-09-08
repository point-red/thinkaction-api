import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { NotificationRepository } from '../../repositories/notification.repository';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../../repositories/user.repository';

export default class UnlikePostService {
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

    if (!alreadyLike) {
      throw new ResponseError(400, "You don't like it yet");
    }

    await this.postRepository.update3(data.postId, authUserId);

    // handle notifications:

    const notificationRepository = this.notificationRepository;
    const notification = await notificationRepository.findOne({
      fromUserId: new ObjectId(authUserId),
      toUserId: statusLike.userId,
      toPostId: statusLike._id,
      type: 'like',
    });

    if (notification?._id) {
      const id = notification?._id.toString();
      await notificationRepository.delete(id);
      await this.userRepository.updateOne10(id);
    }

    let post: any = await this.postRepository.readOne(data.postId);

    return {
      _id: data.postId,
      likeCount: post.likeCount,
      likedByCurrent: false,
    };
  }
}
