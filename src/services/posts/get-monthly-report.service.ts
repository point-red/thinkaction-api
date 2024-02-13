import { PostRepository } from '../../repositories/post.repository';
import { DocInterface } from '../../entities/docInterface';
import { ObjectId } from 'mongodb';

export default class GetMonthlyReportService {
  private postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public async handle(data: DocInterface, authUserId: string) {
    const startDate = new Date(`${data.year}-0${data.month}-01`);
    const endDate = new Date(`${data.year}-0${data.month + 1}-01`);

    const pipeline = [
      {
        $match: {
          userId: new ObjectId(authUserId),
          createdDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
    ];

    const allPost = await this.postRepository.aggregate(pipeline);

    return allPost;
  }
}
