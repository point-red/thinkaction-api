import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../../repositories/user.repository';

export default class GetMonthlyReportService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const startDate = new Date(data.year, data.month - 1, 1); // Menggunakan data.month - 1 untuk mendapatkan bulan sebelumnya
    const endDate = new Date(data.year, data.month, 0);

    const pipeline = [
      {
        $match: {
          _id: new ObjectId(authUserId),
        },
      },
      {
        $unwind: '$categoryResolution',
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'categoryResolution._id',
          foreignField: 'categoryResolutionId',
          as: 'postsData',
        },
      },

      {
        $addFields: {
          postsData: {
            $filter: {
              input: '$postsData',
              as: 'post',
              cond: { $eq: ['$$post.type', 'resolutions'] },
            },
          },
        },
      },
      {
        $unwind: '$postsData',
      },
      {
        $project: {
          _id: 1,
          categoryResolution: {
            $mergeObjects: ['$categoryResolution', { updatedDate: '$postsData.updatedDate' }],
          },
        },
      },
      {
        $match: {
          $and: [
            { 'categoryResolution.createdDate': { $gte: startDate } }, // Memeriksa apakah tanggal createdDate lebih besar dari startDate
            { 'categoryResolution.createdDate': { $lte: endDate } }, // Memeriksa apakah tanggal createdDate kurang dari atau sama dengan endDate
          ],
        },
      },
    ];

    const userRepository = new UserRepository();
    const allPost = await userRepository.aggregate(pipeline);

    return allPost;
  }
}
