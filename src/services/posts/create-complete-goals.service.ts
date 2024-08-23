import { PostEntity } from '../../entities/posts.entity';
import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import UpdateResolutionsService from './update-resolution.service';
import Uploader from '../uploader';
import { ImageService } from '../images/image.service';

export default class CreateCompleteGoalsService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const photos = data.photos;
    if (photos) {
      data.photo = await ImageService.move(photos);
    }

    const postEntity = new PostEntity({
      userId: new ObjectId(authUserId),
      categoryResolutionId: new ObjectId(data.categoryResolutionId),
      type: 'completeGoals',
      caption: data.caption,
      photo: data.photo,
      like: [],
      likeCount: 0,
      commentCount: 0,
      dueDate: new Date(data.dueDate),
      updatedDate: new Date(data.updatedDate),
      shareWith: data.shareWith,
      weeklyGoalId: new ObjectId(data.weeklyGoalId as string),
      isComplete: data.isComplete === 'true',
      isUpdating: false,
      createdDate: new Date(),
    });

    let postData = postEntity.CheckData();

    let post = await this.postRepository.create(postData);

    const dataPost: any = await this.postRepository.readOne(post.insertedId.toString());

    const categoryResolution: any = await this.postRepository.aggregate([
      {
        $match: {
          type: 'resolutions',
        },
      },
      {
        $match: {
          categoryResolutionId: new ObjectId(data.categoryResolutionId),
        },
      },
    ]);

    let updateResolutionsService = new UpdateResolutionsService(this.postRepository);

    const data2 = {
      isComplete: data.isComplete === 'true',
    };

    await updateResolutionsService.handle(data2, authUserId, categoryResolution[0]._id);

    const userRepository = new UserRepository();

    const userData: any = await userRepository.readOne(authUserId);

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
