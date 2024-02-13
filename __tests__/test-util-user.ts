import app from '../src/app';
import request from 'supertest';
import { UserRepository } from '../src/repositories/user.repository';
import { NotificationRepository } from '../src/repositories/notification.repository';

export async function register() {
  const user = {
    username: 'test',
    email: 'test@gmail.com',
    password: '12345678',
  };

  const response = await request(app).post('/v1/users/register').send(user);
  return response;
}

export async function deleteAllUsers() {
  const userRepository = new UserRepository();
  await userRepository.deleteMany();
}

export async function deleteAllNotifications() {
  const notificationRepository = new NotificationRepository();
  await notificationRepository.deleteMany();
}
