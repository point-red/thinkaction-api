import { PostEntity } from '../../entities/posts.entity';
import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';
import Uploader from '../uploader';

export default class UpdateWeeklyGoalsService {
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

    if (photos?.length) {
      photos.forEach((photo: any) => {
        const _path = photo.path;
        if (_path) {
          if (!fs.existsSync(path.join(__dirname, '../../images/'))) {
            fs.mkdirSync(path.join(__dirname, '../../images/'));
          }
          const newPath = path.join(__dirname, '../../images/' + photo.filename);
          fs.renameSync(_path, newPath);
          data.photo.push('images/' + photo.filename);
        }
      });
    } else {
      data.photo = undefined;
    }
    const postEntity = new PostEntity({
      _id: post._id,
      userId: new ObjectId(authUserId),
      categoryResolutionId: data.categoryResolutionId ? new ObjectId(data.categoryResolutionId) : post.categoryResolutionId,
      type: post.type,
      caption: data.caption ?? post.caption,
      photo: data.photo ?? post.photo,
      like: [],
      likeCount: 0,
      commentCount: 0,
      dueDate: new Date(data.dueDate) ?? post.dueDate,
      updatedDate: new Date(),
      shareWith: data.shareWith ?? post.shareWith,
      isComplete: post.isComplete,
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
        categoryResolution: userData.categoryResolution,
      },
    };
  }
}
