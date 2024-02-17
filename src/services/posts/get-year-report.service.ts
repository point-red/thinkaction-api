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

    function getWeeksInYear(year: number, allPost: any) {
      const weeks: any = {};
      let weekNumber = 1;
      const totalCategories: any = {};

      // Inisialisasi totalCategories untuk setiap kategori menjadi 0
      allPost.forEach((item: any) => {
        const categoryResolutionName = item.categoryResolution.name;
        totalCategories[categoryResolutionName] = 0;
      });

      for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const startOfWeek = new Date(currentDate);
          const endOfWeek = new Date(currentDate);
          endOfWeek.setDate(endOfWeek.getDate() + 6);

          const weekObj: any = {};
          let trueCount = 0; // Deklarasi di dalam perulangan untuk setiap minggu

          allPost.forEach((item: any) => {
            const categoryResolutionName = item.categoryResolution.name;
            if (item.categoryResolution.isComplete === true && item.categoryResolution.updatedDate <= endOfWeek) {
              weekObj[categoryResolutionName] = true;
              trueCount++; // Increment trueCount jika nilai true
            } else if (item.categoryResolution.createdDate > endOfWeek) {
              return;
            } else {
              weekObj[categoryResolutionName] = false;
            }
            totalCategories[categoryResolutionName]++; // Increment jumlah total kategori
          });

          // Menghitung persentase nilai true untuk setiap kategori
          const percentage = trueCount / Object.keys(totalCategories).length;
          weeks['percentage'] = percentage; // Menambahkan persentase ke dalam objek minggu

          weeks[`week${weekNumber}`] = weekObj;

          currentDate.setDate(currentDate.getDate() + 7);
          weekNumber++;
        }
      }

      return weeks;
    }

    const weeksInYear = getWeeksInYear(data.year, allPost);
    console.log(weeksInYear);

    return weeksInYear;
  }
}
