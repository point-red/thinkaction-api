import { UserEntity } from '../../entities/users.entity';
import { UserRepository } from '../../repositories/user.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import bcrypt from 'bcrypt';

export default class UpdateMyPasswordUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, data: DocInterface) {
    let userNow = await this.userRepository.readOne(id);

    if (!userNow) {
      throw new ResponseError(404, 'User not found');
    }

    const userHasPassword = !!userNow.password;

    if (!data.passwordNew?.length || (userHasPassword && !data.passwordCurrent?.length)) {
      throw new ResponseError(400, 'Password is required');
    }

    if (userHasPassword) {
      const passwordMatch = await bcrypt.compare(data.passwordCurrent, userNow.password);
      if (!passwordMatch) {
        throw new ResponseError(400, 'Current password is wrong');
      }
    }

    const hashedPass = await bcrypt.hash(data.passwordNew, 12);

    const userEntity = new UserEntity({
      email: userNow.email,
      username: userNow.username,
      password: hashedPass,
      fullname: userNow.fullname,
      bio: userNow.bio,
      photo: userNow.photo,
      supporter: userNow.supporter,
      supporting: userNow.supporting,
      request: userNow.request,
      notification: userNow.notification,
      goalsPerformance: userNow.goalsPerformance,
      supporterCount: userNow.supporterCount,
      supportingCount: userNow.supportingCount,
      requestCount: userNow.requestCount,
      notificationCount: userNow.notificationCount,
      historyAccount: userNow.historyAccount,
      categoryResolution: userNow.categoryResolution,
      isPublic: userNow.isPublic,
      isUpdating: userNow.isUpdating,
    });

    let userData = userEntity.CheckData();

    await this.userRepository.update(id, userData);

    const dataUser = await this.userRepository.readOne(id);

    if (!dataUser) {
      throw new ResponseError(404, 'User not found');
    }

    return {
      _id: dataUser._id,
      fullname: dataUser.fullname,
      username: dataUser.username,
      email: dataUser.email,
      bio: dataUser.bio,
      supporterCount: dataUser.supporterCount,
      supportingCount: dataUser.supportingCount,
      photo: dataUser.photo,
      categoryResolution: dataUser.categoryResolution,
      isPublic: dataUser.isPublic,
    };
  }
}
