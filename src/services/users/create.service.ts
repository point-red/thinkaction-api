import { UserEntity } from '../../entities/users.entity';
import { UserRepository } from '../../repositories/user.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import bcrypt from 'bcrypt';

export default class CreateUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(data: DocInterface) {
    if ((await this.userRepository.getUserByEmail(data.email)) !== null) {
      throw new ResponseError(400, 'Email already registered');
    }

    const hashedPass = await bcrypt.hash(data.password, 12);

    const userEntity = new UserEntity({
      username: data.username,
      email: data.email,
      password: hashedPass,
      fullname: data.fullname ?? null,
      bio: data.bio ?? null,
      photo: data.photo ?? null,
      supporter: [],
      supporting: [],
      request: [],
      notification: [],
      goalsPerformance: 0,
      supporterCount: 0,
      supportingCount: 0,
      requestCount: 0,
      notificationCount: 0,
      historyAccount: [],
      categoryResolution: [],
      isPublic: true,
    });

    let userData = userEntity.CheckData();

    let user = await this.userRepository.create(userData);

    const dataUser = await this.userRepository.readOne(user.insertedId.toString());

    if (!dataUser) {
      throw new ResponseError(404, 'User not found');
    }

    return {
      _id: dataUser._id,
      username: dataUser.username,
      fullname: dataUser.fullname,
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
