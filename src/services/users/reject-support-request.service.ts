import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class RejectSupportRequestService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const userToReject = await this.userRepository.readOne(id);

    if (!userToReject) {
      throw new ResponseError(400, 'User not found or not requested');
    }

    await this.userRepository.updateOne7(id, authUserId);

    const updatedUser = await this.userRepository.findOne4(id);

    return updatedUser;
  }
}
