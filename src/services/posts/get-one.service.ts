import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import { ObjectId } from 'mongodb';

export default class GetOnePostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(authUserId: string, id: string) {
    const pipeline = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $addFields: {
          userInfo: {
            $arrayElemAt: ['$userInfo', 0],
          },
          likedByCurrent: {
            $in: [new ObjectId(authUserId), "$like"]
          }
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          categoryResolutionId: 1,
          type: 1,
          caption: 1,
          photo: 1,
          likeCount: 1,
          likedByCurrent: 1,
          commentCount: 1,
          dueDate: 1,
          createdDate: 1,
          updatedDate: 1,
          shareWith: 1,
          isComplete: 1,
          userInfo: {
            _id: 1,
            username: 1,
            photo: 1,
            resolution: 1,
            categoryResolution: 1,
          },
        },
      },
    ];

    const onePost = await this.postRepository.aggregate(pipeline);

    return onePost[0];
  }
}
