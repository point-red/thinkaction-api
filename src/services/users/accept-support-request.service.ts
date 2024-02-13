import { ResponseError } from '../../middleware/error.middleware';
import { UserRepository } from '../../repositories/user.repository';

export default class AcceptSupportRequestService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, authUserId: string) {
    const userToAccept = await this.userRepository.readOne(id);

    if (!userToAccept) {
      throw new ResponseError(400, 'User not found or not requested');
    }

    await this.userRepository.updateOne6(id, authUserId);

    await this.userRepository.updateOne2(id, authUserId);

    const updatedUser = await this.userRepository.findOne4(id);

    return updatedUser;
  }
}
