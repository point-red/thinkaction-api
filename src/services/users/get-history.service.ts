import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class GetHistoryService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(authUserId: string) {
    const pipeline = [
      {
        $match: { _id: new ObjectId(authUserId) },
      },
      {
        $project: {
          historyAccount: { $slice: ['$historyAccount', -5] },
        },
      },
      {
        $unwind: '$historyAccount',
      },
      {
        $replaceRoot: { newRoot: '$historyAccount' },
      },
    ];

    const result = (await this.userRepository.aggregate(pipeline)).reverse();

    return result;
  }
}
