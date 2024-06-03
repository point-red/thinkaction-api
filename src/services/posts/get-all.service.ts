import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ObjectId } from 'mongodb';
import GetImageService from '../images/get-image.service';

export default class GetAllPostService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(authUserId: string, data: DocInterface) {
    const pipeline = [
      {
        $match: {
          $expr: {
            $cond: {
              if: { $ne: [data.userId, null] },
              then: { $eq: ['$userId', new ObjectId(data.userId)] },
              else: true,
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: { $ne: [data.startDate, null] },
              then: { $gte: ['$createdDate', { $toDate: data.startDate }] },
              else: true,
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: { $ne: [data.endDate, null] },
              then: { $lte: ['$createdDate', { $toDate: data.endDate }] },
              else: true,
            },
          },
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: { $ne: [data.categoryResolutionId, null] },
              then: { $eq: ['$categoryResolutionId', new ObjectId(data.categoryResolutionId as string)] },
              else: true,
            },
          },
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
          likedByCurrent: new ObjectId(authUserId)
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
            fullname: 1,
            photo: 1,
            resolution: 1,
            categoryResolution: 1,
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: (Number(data.page) - 1) * Number(data.limit) }, { $limit: Number(data.limit) }],
        },
      },
    ];

    if (data.sort && data.order) {
      const sortField = data.sort;
      const sortOrder = data.order === 'asc' ? 1 : -1;

      const sortStage: any = {
        $sort: {
          [sortField]: sortOrder,
        },
      };
      pipeline.push(sortStage);
    } else if (!data.sort && data.order) {
      const sortOrder = data.order === 'asc' ? 1 : -1;
      const sortStage: any = {
        $sort: {
          createdDate: sortOrder,
        },
      };
      pipeline.push(sortStage);
    } else {
      const sortStage: any = {
        $sort: {
          createdDate: -1,
        },
      };
      pipeline.push(sortStage);
    }

    const allPost = await this.postRepository.aggregate(pipeline);


    return {
      total: allPost[0].metadata[0].totalCount, 
      page: Number(data.page), 
      limit: Number(data.limit),
      data: allPost[0].data
    }
  }
}
