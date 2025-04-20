import { PostRepository } from "../../repositories/post.repository";
import { DocInterface } from "../../entities/docInterface";
import { ObjectId } from "mongodb";
import { UserRepository } from "../../repositories/user.repository";

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
        $unwind: "$categoryResolution",
      },
      {
        $match: {
          "categoryResolution.createdDate": {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$categoryResolution.createdDate" },
            week: { $week: "$categoryResolution.createdDate" },
          },
          count: { $sum: 1 },
          categories: { $push: "$categoryResolution" },
        },
      },
      {
        $sort: { "_id.week": 1 },
      },
    ];

    const userRepository = new UserRepository();
    const results = await userRepository.aggregate(pipeline);

    function getWeeksInMonth(year: number, month: number) {
      const weeks = [];
      let startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      while (startDate <= endDate) {
        const weekNum = Math.ceil(startDate.getDate() / 7);
        weeks[weekNum - 1] = {
          weekNumber: weekNum,
          count: 0,
          categories: [],
        };
        startDate.setDate(startDate.getDate() + 7);
      }
      return weeks;
    }

    const weeksInMonth = getWeeksInMonth(Number(data.year), Number(data.month));

    // Map results to weeks
    results.forEach((result) => {
      const weekNum = Math.ceil(
        new Date(result.categories[0].createdDate).getDate() / 7
      );
      if (weeksInMonth[weekNum - 1]) {
        weeksInMonth[weekNum - 1].count = result.count;
        weeksInMonth[weekNum - 1].categories = result.categories;
      }
    });

    const response = {
      total: results.reduce((acc, curr) => acc + curr.count, 0),
      weeks: weeksInMonth,
    };

    return response;
  }
}
