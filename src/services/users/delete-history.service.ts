import { UserRepository } from '../../repositories/user.repository';

export default class DeleteHistoryService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(authUserId: string) {
    await this.userRepository.updateOne9(authUserId);
  }
}
