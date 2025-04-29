import { PostRepository } from "../../repositories/post.repository";
import { DocInterface } from "../../entities/docInterface";
import { ObjectId } from "mongodb";

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
          categories: { $push: "$user.categoryResolution" }, // Changed to $push
        },
      },
      {
        $sort: { "_id.week": 1 },
      },
    ];

    const results = await this.postRepository.aggregate(pipeline);

    function getWeeksInYear(year: number) {
      const weeks = [];
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const weekNum = getWeekNumber(currentDate);
        if (!weeks[weekNum - 1]) {
          weeks[weekNum - 1] = {
            weekNumber: weekNum,
            count: 0,
            categories: [],
          };
        }
        currentDate.setDate(currentDate.getDate() + 7);
      }
      return weeks;
    }

    function getWeekNumber(date: Date) {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    const weeksInYear = getWeeksInYear(Number(data.year));

    // Map results to weeks
    results.forEach((result) => {
      const weekNum = result._id.week;
      if (weeksInYear[weekNum - 1]) {
        weeksInYear[weekNum - 1].count = result.count;
        weeksInYear[weekNum - 1].categories = result.categories;
      }
    });

    const response = {
      total: results.reduce((acc, curr) => acc + curr.count, 0),
      weeks: weeksInYear
        .filter((week) => week !== null)
        .map((weekData) => ({
          weekNumber: weekData.weekNumber,
          count: weekData.count,
          categories: weekData.categories,
        })),
    };

    return response;
  }
}
