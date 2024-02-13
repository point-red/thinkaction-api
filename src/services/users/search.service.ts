import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class SearchUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(username: string, authUserId: string) {
    const authUser: any = await this.userRepository.readOne(authUserId);

    const supportingIds = authUser.supporting;

    const pipeline = [
      {
        $match: {
          username: { $regex: new RegExp('.*' + username + '.*', 'i') },
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'supporter',
          foreignField: '_id',
          as: 'supportedByDetails',
        },
      },
      {
        $addFields: {
          supportedByCount: { $size: '$supportedByDetails' },
          supportedBy: {
            $map: {
              input: '$supportedByDetails',
              as: 'detail',
              in: {
                _id: '$$detail._id',
                username: '$$detail.username',
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          photo: 1,
          supportedByCount: 1,
          supportedBy: 1,
        },
      },
    ];

    const data = await this.userRepository.aggregate(pipeline);

    await this.userRepository.updateOne8(data, authUserId);
    return data;
  }
}
