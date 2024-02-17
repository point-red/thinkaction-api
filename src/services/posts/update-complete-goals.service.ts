import { PostEntity } from '../../entities/posts.entity';
import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import UpdateResolutionsService from './update-resolution.service';

export default class UpdateCompleteGoalsService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string, id: string) {
    const post = await this.postRepository.readOne(id);

    if (!post) {
      throw new ResponseError(400, 'Post not found');
    }

    const postEntity = new PostEntity({
      _id: post._id,
      userId: new ObjectId(authUserId),
      categoryResolutionId: new ObjectId(data.categoryResolutionId) ?? post.categoryResolutionId,
      type: post.type,
      caption: data.caption ?? post.caption,
      photo: post.photo,
      like: [],
      likeCount: 0,
      commentCount: 0,
      dueDate: post.dueDate,
      updatedDate: new Date(),
      shareWith: data.shareWith ?? post.shareWith,
      weeklyGoalId: new ObjectId(data.weeklyGoalId) ?? post.weeklyGoalId,
      isComplete: data.isComplete ?? post.isComplete,
      isUpdating: true,
      createdDate: post.createdDate,
    });

    let postData = postEntity.CheckData();

    await this.postRepository.update(id, postData);

    const dataPost = await this.postRepository.readOne(id);
    if (!dataPost) {
      throw new ResponseError(404, 'Comment not found');
    }

    const categoryResolution: any = await this.postRepository.aggregate([
      {
        $match: {
          type: 'resolutions',
        },
      },
      {
        $match: {
          categoryResolutionId: dataPost.categoryResolutionId,
        },
      },
    ]);
    let updateResolutionsService = new UpdateResolutionsService(this.postRepository);

    const data2 = {
      isComplete: dataPost.isComplete,
    };

    await updateResolutionsService.handle(data2, authUserId, categoryResolution[0]._id);

    const userRepository = new UserRepository();

    const userData = await userRepository.readOne(authUserId);

    if (!userData) {
      throw new ResponseError(404, 'User not found');
    }

    return {
      _id: dataPost._id,
      userId: dataPost.userId,
      categoryResolutionId: dataPost.categoryResolutionId,
      weeklyGoalId: dataPost.weeklyGoalId,
      type: dataPost.type,
      caption: dataPost.caption,
      photo: dataPost.photo,
      likeCount: dataPost.likeCount,
      commentCount: dataPost.commentCount,
      dueDate: dataPost.dueDate,
      createdDate: dataPost.createdDate,
      updatedDate: dataPost.updatedDate,
      shareWith: dataPost.shareWith,
      isComplete: dataPost.isComplete,
      userInfo: {
        _id: userData._id,
        username: userData.username,
        photo: userData.photo,
        categoryResolution: userData.categoryResolution,
      },
    };
  }
}
