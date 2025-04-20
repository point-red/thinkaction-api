import { PostRepository } from "../../repositories/post.repository";
import { DocInterface } from "../../entities/docInterface";
import { ObjectId } from "mongodb";
import { UserRepository } from "../../repositories/user.repository";

export default class GetMonthlyReportService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const startDate = new Date(data.year, data.month - 1, 1);
    const endDate = new Date(data.year, data.month, 0);

    const pipeline = [
      {
        $match: {
          userId: new ObjectId(authUserId),
          createdDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$user.categoryResolution",
      },
      {
        $match: {
          $expr: {
            $eq: ["$categoryResolutionId", "$user.categoryResolution._id"],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdDate" },
            week: { $week: "$createdDate" },
          },
          count: { $sum: 1 },
          categories: { $push: "$user.categoryResolution" },
        },
      },
      {
        $sort: { "_id.week": 1 },
      },
    ];

    const results = await this.postRepository.aggregate(pipeline);

    function getWeeksInMonth(year: number, month: number) {
      const weeks = [];
      let startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      while (startDate <= endDate) {
        const weekNum = getWeekNumber(startDate);
        if (!weeks[weekNum - 1]) {
          weeks[weekNum - 1] = {
            weekNumber: weekNum,
            count: 0,
            categories: [],
          };
        }
        startDate.setDate(startDate.getDate() + 7);
      }
      return weeks;
    }

    function getWeekNumber(date: Date) {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    const weeksInMonth = getWeeksInMonth(Number(data.year), Number(data.month));

    // Map results to weeks
    results.forEach((result) => {
      const weekNum = result._id.week;
      if (weeksInMonth[weekNum - 1]) {
        weeksInMonth[weekNum - 1].count = result.count;
        weeksInMonth[weekNum - 1].categories = result.categories;
      }
    });

    const response = {
      total: results.reduce((acc, curr) => acc + curr.count, 0),
      weeks: weeksInMonth
        .filter((week) => week !== undefined)
        .map((weekData) => ({
          weekNumber: weekData.weekNumber,
          count: weekData.count,
          categories: weekData.categories,
        })),
    };

    return response;
  }
}
