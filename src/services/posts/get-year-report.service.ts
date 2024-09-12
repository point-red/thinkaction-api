import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../../repositories/user.repository';

export default class GetYearReportService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const startDate = new Date(data.year, 0, 1);
    const endDate = new Date(data.year, 11, 31);

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
        $match: {
          "categoryResolution.createdDate": {
            $gte: startDate,
            $lt: endDate
          }
        },
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
          completeData: {
            $filter: {
              input: "$postsData",
              as: "post",
              cond: {
                $and: [
                  { $eq: ["$$post.type", "completeGoals"] },
                  { $eq: ["$$post.isComplete", true] },
                ]
              }
            }
          }
        },
      },
      {
        $unwind: '$postsData',
      },
      {
        $unwind: {
          path: "$completeData",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $project: {
          _id: 1,
          resolution: {
            $mergeObjects: ["$categoryResolution", {
              "updatedDate": "$postsData.updatedDate"
            }, {
                "dueDate": "$postsData.dueDate"
              }, {
                "completeDate": "$completeData.createdDate"
              }]
          }
        },
      },
    ];

    const userRepository = new UserRepository();
    const allPost = await userRepository.aggregate(pipeline);

    function getWeeksInYear(year: number) {
      const weeks = [];
      let startDate = new Date(year, 0, 1);

      while (startDate.getDay() !== 1) {
        startDate.setDate(startDate.getDate() + 1);
      }

      let endDate = new Date(startDate);

      while (startDate.getFullYear() <= year) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        weeks.push({
          weekNumber: weeks.length + 1,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        });

        startDate.setDate(startDate.getDate() + 7);
      }

      return weeks;
    }

    const weeksInYear = getWeeksInYear(Number(data.year));
    const map: Record<string, Record<string, boolean>> = {};
    const currentDate = new Date();
    const started: Record<string, boolean> = {};
    const ended: Record<string, boolean> = {};
    for (const { weekNumber, startDate, endDate } of weeksInYear) {
      const weekStr = 'Week ' + weekNumber;
      if (!map[weekStr]) {
        map[weekStr] = {};
      }
      if (startDate > currentDate) {
        continue;
      }
      for (const { resolution } of allPost) {
        if (resolution.createdDate < endDate && !started[resolution.name]) {
          started[resolution.name] = true;
        }
        if (started[resolution.name] && !ended[resolution.name]) {
          const completed = resolution.isComplete && resolution.completeDate && resolution.completeDate < resolution.dueDate && resolution.completeDate < endDate;
          map[weekStr][resolution.name] = completed;
        }
        if (resolution.completeDate && resolution.completeDate < endDate) {
          ended[resolution.name] = true;
        }
      }
    }

    return map;
  }
}
