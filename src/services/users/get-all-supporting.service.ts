import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetAllSupportingService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      { $unwind: '$supporting' },
      { $skip: +skip },
      { $limit: +limit },
      {
        $lookup: {
          from: 'users',
          localField: 'supporting',
          foreignField: '_id',
          as: 'supportingDetails',
        },
      },
      { $unwind: '$supportingDetails' },
      {
        $addFields: {
          'supportingDetails.isSupporting': {
            $in: [new ObjectId(authUserId), '$supportingDetails.supporter'],
          },
        },
      },
      {
        $replaceRoot: { newRoot: '$supportingDetails' },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          email: 1,
          bio: 1,
          photo: 1,
          categoryResolution: 1,
          isPublic: 1,
          supporterCount: 1,
          supportingCount: 1,
          isSupporting: 1,
        },
      },
    ];

    const data = await this.userRepository.aggregate(pipeline);
    return data.map((supporting) => ({
      ...supporting,
      isAuthenticatedUser: supporting._id.equals(new ObjectId(authUserId)),
    }));
  }
}
