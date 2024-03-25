import { UserEntity } from '../../entities/users.entity';
import { UserRepository } from '../../repositories/user.repository';
import { DocInterface } from '../../entities/docInterface';
import { ResponseError } from '../../middleware/error.middleware';
import fs from 'fs';
import path from 'path';

export default class UpdateCurrentUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async handle(id: string, data: DocInterface) {
    let userNow = await this.userRepository.readOne(id);

    if (!userNow) {
      throw new ResponseError(404, 'User not found');
    }

    const photo = data.photo;
    if (photo) {
      const _path = photo.path;
      if (_path) {
        if (!fs.existsSync(path.join(__dirname, '../../images/'))) {
          fs.mkdirSync(path.join(__dirname, '../../images/'));
        }
        if (userNow.photo) {
          const photoNow = path.join(__dirname, '../../', userNow.photo);
          if (fs.existsSync(photoNow)) {
            fs.rmSync(photoNow);
          }
        }
        const newPath = path.join(__dirname, '../../images/' + photo.filename);
        fs.renameSync(_path, newPath);
        data.photo = 'images/' + photo.filename;
      }
    } else {
      data.photo = userNow.photo;
    }

    if (typeof data.isPublic === 'string') {
      data.isPublic = data.isPublic === 'true';
    }

    const userEntity = new UserEntity({
      email: userNow.email,
      username: data.username ?? userNow.username,
      password: userNow.password,
      fullname: data.fullname ?? userNow.fullname,
      bio: data.bio ?? userNow.bio,
      photo: data.photo ?? userNow.photo,
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
      isPublic: data.isPublic ?? userNow.isPublic,
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
