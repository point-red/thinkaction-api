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
    const startDate = new Date(data.year, data.month - 1, 1);
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
          $and: [{ 'categoryResolution.createdDate': { $gte: startDate } }, { 'categoryResolution.createdDate': { $lte: endDate } }],
        },
      },
    ];

    const userRepository = new UserRepository();
    const allPost = await userRepository.aggregate(pipeline);

    function getWeeksInMonth(year: number, month: number, allPost: any) {
      const weeks: any = {};

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      let currentDate = new Date(startDate);
      let weekNumber = 1;

      while (currentDate <= endDate) {
        const startOfWeek = new Date(currentDate);
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const weekObj: any = {};

        allPost.forEach((item: any) => {
          const categoryResolutionName = item.categoryResolution.name;
          if (item.categoryResolution.isComplete === true && item.categoryResolution.updatedDate <= endOfWeek) {
            weekObj[categoryResolutionName] = true;
            weekObj['startDate'] = startOfWeek;
            weekObj['endDate'] = endOfWeek;
          } else {
            weekObj[categoryResolutionName] = false;
            weekObj['startDate'] = startOfWeek;
            weekObj['endDate'] = endOfWeek;
          }
        });

        weeks['week' + weekNumber] = weekObj;

        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
      }

      return weeks;
    }

    const weeksInMonth = getWeeksInMonth(data.year, data.month, allPost);
    console.log(weeksInMonth);

    return weeksInMonth;
  }
}
