import app from '../src/app';
import request from 'supertest';
import { register } from './test-util-user';

export async function createResolutionPost() {
  const currentUser = await register();

  const dataPost = {
    categoryName: 'Finance',
    caption: 'I want to get Rp 30.000.000',
    photo: ['linkphoto1.png'],
    dueDate: '2024-10-25T10:39:58.606Z',
    shareWith: 'everyone',
  };

  const response = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);
}
