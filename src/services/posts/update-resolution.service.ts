import { PostEntity } from '../../entities/posts.entity';
import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';
import Uploader from '../uploader';

export default class UpdateResolutionsService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string, id: string) {
    const post = await this.postRepository.readOne(id);

    if (!post) {
      throw new ResponseError(400, 'Post not found');
    }
    const photos = data.photos;
    const uploader = new Uploader(data.photos);
    if (photos) {
      data.photo = uploader.move();
    }

    const postEntity = new PostEntity({
      _id: post._id,
      userId: new ObjectId(authUserId),
      categoryResolutionId: post.categoryResolutionId,
      type: post.type,
      caption: data.caption ?? post.caption,
      photo: data.photo ?? post.photo,
      like: [],
      likeCount: 0,
      commentCount: 0,
      dueDate: new Date(data.dueDate) ?? post.dueDate,
      updatedDate: new Date(),
      shareWith: data.shareWith ?? post.shareWith,
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

    const userRepository = new UserRepository();
    const userData = await userRepository.readOne(authUserId);

    if (!userData) {
      throw new ResponseError(404, 'User not found');
    }

    let resolutionObj = userData.categoryResolution.find((item: any) => item._id.toString() === dataPost.categoryResolutionId.toString());

    let name = resolutionObj && resolutionObj.name;

    console.log('isi dari iscomplete', dataPost.isComplete);

    const categoryResolution = {
      _id: dataPost.categoryResolutionId,
      name: data.categoryName ?? name,
      resolution: dataPost.caption,
      isComplete: dataPost.isComplete,
      createdDate: dataPost.createdDate,
    };

    await userRepository.updateOne12(authUserId, categoryResolution);

    const userData2 = await userRepository.readOne(authUserId);

    if (!userData2) {
      throw new ResponseError(404, 'User not found');
    }

    return {
      _id: dataPost._id,
      userId: dataPost.userId,
      categoryResolutionId: dataPost.categoryResolutionId,
      type: dataPost.type,
      caption: dataPost.caption,
      photo: dataPost.photo,
      likeCount: dataPost.likeCount,
      commentCount: dataPost.commentCount,
      dueDate: dataPost.dueDate,
      createdDate: dataPost.createdDate,
      updatedDate: dataPost.updatedDate,
      shareWith: dataPost.shareWith,
      userInfo: {
        _id: userData._id,
        username: userData.username,
        photo: userData.photo,
        categoryResolution: userData2.categoryResolution,
      },
    };
  }
}
