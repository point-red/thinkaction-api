import { UserRepository } from '../../repositories/user.repository';
import { ObjectId } from 'mongodb';

export default class CreateHistoryService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    if (id !== authUserId) {
      const _a = await this.userRepository.updateRemoveHistory(id, authUserId);
      return await this.userRepository.updateOne8(id, authUserId);
    }
    return true;
  }
}
