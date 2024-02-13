import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetOneUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const isAuthenticatedUser = authUserId == id;

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      {
        $addFields: {
          isAuthenticatedUser,
          ...(isAuthenticatedUser
            ? {}
            : {
                isSupporting: {
                  $in: [authUserId, '$supporter'],
                },
              }),
        },
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
          notificationCount: 1,
          requestCount: 1,
          goalsPerformance: 1,
          isAuthenticatedUser: 1,
          isSupporting: 1,
        },
      },
    ];

    const result = await this.userRepository.aggregate(pipeline);

    return result[0];
  }
}
