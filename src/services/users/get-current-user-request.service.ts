import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetCurrentUserRequestService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(authUserId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    // Define the aggregation pipeline
    const pipeline = [
      { $match: { _id: new ObjectId(authUserId) } },
      { $unwind: '$request' },
      { $skip: +skip },
      { $limit: +limit },
      {
        $lookup: {
          from: 'users',
          localField: 'request',
          foreignField: '_id',
          as: 'requestDetails',
        },
      },
      { $unwind: '$requestDetails' },
      {
        $addFields: {
          'requestDetails.isSupporting': {
            $in: [new ObjectId(authUserId), '$requestDetails.supporter'],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$requestDetails' },
      },
      {
        $project: {
          _id: 1,
          fullname: 1,
          username: 1,
          email: 1,
          bio: 1,
          photo: 1,
          categoryResolution: 1,
          isPublic: 1,
          supporterCount: 1,
          supportingCount: 1,
        },
      },
    ];

    const data = await this.userRepository.aggregate(pipeline);

    return data;
  }
}
