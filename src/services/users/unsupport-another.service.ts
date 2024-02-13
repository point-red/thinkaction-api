import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class UnsupportAnotherUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const userToUnsupport = await this.userRepository.findOne3(id, authUserId);

    if (!userToUnsupport) {
      throw new ResponseError(400, 'User not found or not supported');
    }

    await this.userRepository.updateOne4(id, authUserId);

    await this.userRepository.updateOne5(id, authUserId);

    const updatedUser = await this.userRepository.findOne2(id);

    return updatedUser;
  }
}
