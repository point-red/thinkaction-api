import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ObjectId } from 'mongodb';

export default class GetAllLikePostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(idPost: string, authUserId: string) {
    const authId = new ObjectId(authUserId);
    const pipeline = [
      {
        $match: { _id: new ObjectId(idPost) },
      },
      { $unwind: '$like' },
      {
        $lookup: {
          from: 'users',
          localField: 'like',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $replaceRoot: { newRoot: '$userInfo' },
      },
      {
        $addFields: {
          isSupporting: {
            $in: [authId, '$supporter'],
          },
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          email: 1,
          bio: 1,
          supportingCount: 1,
          supporterCount: 1,
          photo: 1,
          categoryResolution: 1,
          isSupporting: 1,
          isPublic: 1,
        },
      },
    ];
    const allPost = await this.postRepository.aggregate(pipeline);

    return allPost;
  }
}
