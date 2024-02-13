import request from 'supertest';
import app from '../src/app';
import { deleteAllNotifications, deleteAllUsers, register } from './test-util-user';
import { deleteAllComments, deleteAllPosts } from './test-util-comments';

describe('POST /v1/users/register', () => {
  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can create new user', async () => {
    const user = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };

    const response = await request(app).post('/v1/users/register').send(user);

    expect(response.status).toBe(200);
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(user.username);
    expect(response.body.data.user.email).toEqual(user.email);
    expect(response.body.data.user.password).toBeUndefined();
  });
});

describe('POST /v1/users/login', () => {
  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can login', async () => {
    const user = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };

    await request(app).post('/v1/users/register').send(user);

    const response = await request(app).post('/v1/users/login').send({
      email: 'test@gmail.com',
      password: '12345678',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(user.username);
    expect(response.body.data.user.email).toEqual(user.email);
    expect(response.body.data.user.password).toBeUndefined();
  });
});

describe('GET /v1/users/logout', () => {
  it('should can logout', async () => {
    const response = await request(app).get('/v1/users/logout');

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Sucessfully logout.');
  });
});

describe('PATCH /v1/users/updateMyPassword', () => {
  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can update password', async () => {
    const user = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };

    const result = await request(app).post('/v1/users/register').send(user);

    const response = await request(app).patch('/v1/users/updateMyPassword').set('Authorization', `Bearer ${result.body.token}`).send({
      passwordCurrent: '12345678',
      passwordNew: '87654321',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.token).toBeDefined();
    expect(response.body.data.user._id).toBeDefined();
    expect(response.body.data.user.username).toEqual(user.username);
    expect(response.body.data.user.email).toEqual(user.email);
    expect(response.body.data.user.password).toBeUndefined();
  });
});

describe('GET /v1/users/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get one user if user auth', async () => {
    const result = await register();

    const response = await request(app).get(`/v1/users/${result.body.data.user._id}`).set('Authorization', `Bearer ${result.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.username).toEqual(result.body.data.user.username);
    expect(response.body.data.email).toEqual(result.body.data.user.email);
    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.isSupporting).toBeUndefined();
    expect(response.body.data.isAuthenticatedUser).toBeDefined();
  });

  it('should can get one another user', async () => {
    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };

    const responseOtherUser = await request(app).post('/v1/users/register').send(otherUser);

    const result = await register();

    const response = await request(app).get(`/v1/users/${responseOtherUser.body.data.user._id}`).set('Authorization', `Bearer ${result.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.username).toEqual(responseOtherUser.body.data.user.username);
    expect(response.body.data.email).toEqual(responseOtherUser.body.data.user.email);
    expect(response.body.data.password).toBeUndefined();
    expect(response.body.data.isSupporting).toBeDefined();
  });
});

describe('GET /v1/users/:id/supporter', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get all supporter user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };

    const resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: resultOtherUser.body.data.user._id });

    const data = { limit: 5, page: 1 };

    const response = await request(app).get(`/v1/users/${resultOtherUser.body.data.user._id}/supporter`).set('Authorization', `Bearer ${currentUser.body.token}`).send(data);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(data.limit);
    expect(response.body.page).toEqual(data.page);
    expect(response.body.results).toBeDefined();
    expect(response.body.data[0]._id).toEqual(currentUser.body.data.user._id);
    expect(response.body.data[0].username).toEqual(currentUser.body.data.user.username);
    expect(response.body.data[0].email).toEqual(currentUser.body.data.user.email);
  });
});

describe('GET /v1/users/:id/supporting', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get all supporting user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };

    const resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: resultOtherUser.body.data.user._id });

    const data = { limit: 5, page: 1 };

    const response = await request(app).get(`/v1/users/${currentUser.body.data.user._id}/supporting`).set('Authorization', `Bearer ${currentUser.body.token}`).send(data);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(data.limit);
    expect(response.body.page).toEqual(data.page);
    expect(response.body.results).toBeDefined();
    expect(response.body.data[0]._id).toEqual(resultOtherUser.body.data.user._id);
    expect(response.body.data[0].username).toEqual(resultOtherUser.body.data.user.username);
    expect(response.body.data[0].email).toEqual(resultOtherUser.body.data.user.email);
  });
});

describe('GET /v1/users/request', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get current user request', async () => {
    const user = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${user.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const data = {
      limit: 9,
      page: 1,
    };

    const response = await request(app).get('/v1/users/request').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send(data);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(data.limit);
    expect(response.body.page).toEqual(data.page);
    expect(response.body.results).toBeDefined();
    expect(response.body.data[0]._id).toEqual(user.body.data.user._id);
    expect(response.body.data[0].username).toEqual(user.body.data.user.username);
    expect(response.body.data[0].email).toEqual(user.body.data.user.email);
  });
});

describe('GET /v1/users/notification', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get current user notification', async () => {
    const user = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${user.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const response = await request(app).get('/v1/users/notification').set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(20);
    expect(response.body.results).toBeDefined();
    expect(response.body.data.today[0]._id).toBeDefined();
    expect(response.body.data.today[0].type).toEqual('request');
  });
});

describe('PATCH /v1/users', () => {
  afterAll(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can update password', async () => {
    const user = {
      username: 'test',
      email: 'test@gmail.com',
      password: '12345678',
    };
    const result = await request(app).post('/v1/users/register').send(user);

    const updateUser = {
      fullname: 'Updated Full Name',
      username: 'Updated username',
      bio: 'Updated bio',
      photo: 'updatedphoto.png',
      isPublic: false,
    };
    const response = await request(app).patch('/v1/users').set('Authorization', `Bearer ${result.body.token}`).send(updateUser);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.fullname).toEqual(updateUser.fullname);
    expect(response.body.data.username).toEqual(updateUser.username);
    expect(response.body.data.email).toEqual(user.email);
    expect(response.body.data.bio).toEqual(updateUser.bio);
    expect(response.body.data.isPublic).toEqual(updateUser.isPublic);
    expect(response.body.data.password).toBeUndefined();
  });
});

describe('POST /v1/users/support', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can support public user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };

    const resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);

    const response = await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: resultOtherUser.body.data.user._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('User is now supported');
    expect(response.body.data._id).toEqual(resultOtherUser.body.data.user._id);
    expect(response.body.data.supporterCount).toEqual(1);
  });

  it('should can support private user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    const response = await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: responseOtherUser.body.data._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Support request sent successfully');
    expect(response.body.data._id).toEqual(responseOtherUser.body.data._id);
  });
});

describe('POST /v1/users/unsupport', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can unsupport user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };

    const resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: resultOtherUser.body.data.user._id });

    const response = await request(app).post('/v1/users/unsupport').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: resultOtherUser.body.data.user._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('User is now unsupported');
    expect(response.body.data._id).toEqual(resultOtherUser.body.data.user._id);
    expect(response.body.data.supporterCount).toEqual(0);
  });
});

describe('POST /v1/users/request/accept', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can accept request user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const response = await request(app).post('/v1/users/request/accept').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({ userId: currentUser.body.data.user._id });
    ``;

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Support request accepted successfully');
    expect(response.body.data._id).toEqual(currentUser.body.data.user._id);
    expect(response.body.data.supportingCount).toBeDefined();
  });
});

describe('POST /v1/users/request/reject', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can reject request user', async () => {
    const currentUser = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${currentUser.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const response = await request(app).post('/v1/users/request/reject').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({ userId: currentUser.body.data.user._id });
    ``;

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Support request rejected successfully');
    expect(response.body.data._id).toEqual(currentUser.body.data.user._id);
    expect(response.body.data.supportingCount).toEqual(0);
  });
});

describe('GET /v1/users/search', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can search user', async () => {
    const result = await register();

    const response = await request(app).get('/v1/users/search').set('Authorization', `Bearer ${result.body.token}`).send({ username: 'test' });

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].username).toEqual(result.body.data.user.username);
    expect(response.body.data[0].password).toBeUndefined();
    expect(response.body.data[0].supportedByCount).toBeDefined();
    expect(response.body.data[0].supportedBy).toBeDefined();
  });
});

describe('GET /v1/users/history', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get history', async () => {
    const result = await register();

    await request(app).get('/v1/users/search').set('Authorization', `Bearer ${result.body.token}`).send({ username: 'test' });

    const response = await request(app).get('/v1/users/history').set('Authorization', `Bearer ${result.body.token}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('DELETE /v1/users/history', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get history', async () => {
    const result = await register();

    await request(app).get('/v1/users/search').set('Authorization', `Bearer ${result.body.token}`).send({ username: 'test' });

    const response = await request(app).delete('/v1/users/history').set('Authorization', `Bearer ${result.body.token}`);

    console.log(response.body);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});

describe('GET /v1/comments/:postId', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can get comment', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const comment = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    const response = await request(app).get(`/v1/comments/${createPost.body.data._id}`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].postId).toEqual(createPost.body.data._id);
    expect(response.body.data[0].userId).toBeDefined();
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].message).toEqual('This is new comment');
    expect(response.body.data[0].type).toEqual('comment');
  });
});

describe('GET /v1/comments/:id/reply', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can get reply comment', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const comment = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    await request(app).post('/v1/comments/reply').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment for reply', replyTo: comment.body.data._id });

    const response = await request(app).get(`/v1/comments/${comment.body.data._id}/reply`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.replyCount).toBeDefined();
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].postId).toEqual(createPost.body.data._id);
    expect(response.body.data[0].userId).toBeDefined();
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].message).toEqual('This is new comment for reply');
    expect(response.body.data[0].type).toEqual('reply');
    expect(response.body.data[0].replyCount).toEqual(0);
  });
});

describe('POST /v1/comments', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create comment', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.postId).toEqual(createPost.body.data._id);
    expect(response.body.data.userId).toEqual(currentUser.body.data.user._id);
    expect(response.body.data.message).toEqual('This is new comment');
    expect(response.body.data.type).toEqual('comment');
  });
});

describe('POST /v1/comments/reply', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create comment reply', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const comment = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    const response = await request(app)
      .post('/v1/comments/reply')
      .set('Authorization', `Bearer ${currentUser.body.token}`)
      .send({ postId: createPost.body.data._id, message: 'This is new comment for reply', replyTo: comment.body.data._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data.comment._id).toBeDefined();
    expect(response.body.data.comment.postId).toEqual(createPost.body.data._id);
    expect(response.body.data.comment.userId).toEqual(currentUser.body.data.user._id);
    expect(response.body.data.comment.message).toEqual('This is new comment for reply');
    expect(response.body.data.comment.userInfo).toBeDefined();
    expect(response.body.data.parentComment._id).toEqual(comment.body.data._id);
    expect(response.body.data.parentComment.postId).toEqual(comment.body.data.postId);
    expect(response.body.data.parentComment.userId).toEqual(comment.body.data.userId);
    expect(response.body.data.parentComment.message).toEqual('This is new comment');
    expect(response.body.data.parentComment.userInfo).toBeDefined();
  });
});

describe('PATCH /v1/comments/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can update comment', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const comment = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    const response = await request(app).patch(`/v1/comments/${comment.body.data._id}`).set('Authorization', `Bearer ${currentUser.body.token}`).send({ message: 'Updated Message' });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toEqual(comment.body.data._id);
    expect(response.body.data.postId).toEqual(createPost.body.data._id);
    expect(response.body.data.userId).toEqual(currentUser.body.data.user._id);
    expect(response.body.data.message).toEqual('Updated Message');
    expect(response.body.data.userInfo._id).toBeDefined();
    expect(response.body.data.userInfo.username).toEqual(currentUser.body.data.user.username);
    expect(response.body.data.userInfo.photo).toEqual(currentUser.body.data.user.photo);
  });
});

describe('DELETE /v1/comments/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can delete comment', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const createPost = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const comment = await request(app).post('/v1/comments').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: createPost.body.data._id, message: 'This is new comment' });

    const response = await request(app).delete(`/v1/comments/${comment.body.data._id}`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});

describe('GET /v1/notifications', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get user notification', async () => {
    const user = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${user.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const response = await request(app).get('/v1/notifications').set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.limit).toEqual(10);
    expect(response.body.page).toEqual(1);
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].type).toEqual('request');
    expect(response.body.data[0].message).toBeDefined();
  });
});

describe('GET /v1/notifications/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can get user notification by id', async () => {
    const user = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${user.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const notification = await request(app).get('/v1/notifications').set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    const response = await request(app).get(`/v1/notifications/${notification.body.data[0]._id}`).set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toEqual(notification.body.data[0]._id);
    expect(response.body.data.type).toEqual(notification.body.data[0].type);
    expect(response.body.data.message).toEqual(notification.body.data[0].message);
  });
});

describe('DELETE /v1/notifications/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
  });

  it('should can delete user notification by id', async () => {
    const user = await register();

    const otherUser = {
      username: 'other',
      email: 'other@gmail.com',
      password: '12345678',
    };
    let resultOtherUser = await request(app).post('/v1/users/register').send(otherUser);
    const responseOtherUser = await request(app).patch('/v1/users').set('Authorization', `Bearer ${resultOtherUser.body.token}`).send({
      isPublic: false,
    });

    await request(app).post('/v1/users/support').set('Authorization', `Bearer ${user.body.token}`).send({ userId: responseOtherUser.body.data._id });

    const notification = await request(app).get('/v1/notifications').set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    const response = await request(app).delete(`/v1/notifications/${notification.body.data[0]._id}`).set('Authorization', `Bearer ${resultOtherUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});

describe('GET /v1/posts', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can get all posts', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).get('/v1/posts').set('Authorization', `Bearer ${currentUser.body.token}`).send({
      startDate: '2023-10-20',
      sort: 'createdDate',
      order: 'asc',
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].userId).toBeDefined();
    expect(response.body.data[0].categoryResolutionId).toBeDefined();
    expect(response.body.data[0].userInfo).toBeDefined();
    expect(response.body.data[0].type).toEqual('resolutions');
    expect(response.body.data[0].caption).toEqual(dataPost.caption);
    expect(response.body.data[0].photo).toEqual(dataPost.photo);
    expect(response.body.data[0].dueDate).toEqual(dataPost.dueDate);
    expect(response.body.data[0].shareWith).toEqual(dataPost.shareWith);
  });
});

describe('GET /v1/posts/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can get one post', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const post = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).get(`/v1/posts/${post.body.data._id}`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.categoryResolution).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual(dataPost.caption);
    expect(response.body.data.photo).toEqual(dataPost.photo);
    expect(response.body.data.dueDate).toEqual(dataPost.dueDate);
    expect(response.body.data.shareWith).toEqual(dataPost.shareWith);
  });
});

describe('GET /v1/posts/:id/like', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can like post', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const post = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    await request(app).post('/v1/posts/like').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: post.body.data._id });

    const response = await request(app).get(`/v1/posts/${post.body.data._id}/like`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.likeCount).toBeDefined();
    expect(response.body.data[0]._id).toBeDefined();
    expect(response.body.data[0].username).toEqual(currentUser.body.data.user.username);
    expect(response.body.data[0].fullname).toBeDefined();
    expect(response.body.data[0].email).toEqual(currentUser.body.data.user.email);
    expect(response.body.data[0].categoryResolution).toBeDefined();
    expect(response.body.data[0].isSupporting).toBeDefined();
  });
});

describe('POST /v1/posts/resolutions', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create one resolution', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const response = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual(dataPost.caption);
    expect(response.body.data.photo).toEqual(dataPost.photo);
    expect(response.body.data.dueDate).toEqual(dataPost.dueDate);
    expect(response.body.data.shareWith).toEqual(dataPost.shareWith);
  });
});

describe('POST /v1/posts/weeklyGoals', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create one resolution', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const resolution = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const dataWeeklyGoal = { categoryResolutionId: resolution.body.data.categoryResolutionId, caption: 'This week I want to get Rp 1.000.000', photo: ['linkphoto1.png'], dueDate: '2023-11-30T10:39:58.606Z', shareWith: 'everyone' };

    const response = await request(app).post('/v1/posts/weeklyGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataWeeklyGoal);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toEqual(dataWeeklyGoal.categoryResolutionId);
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.categoryResolution).toBeDefined();
    expect(response.body.data.type).toEqual('weeklyGoals');
    expect(response.body.data.caption).toEqual(dataWeeklyGoal.caption);
    expect(response.body.data.photo).toEqual(dataWeeklyGoal.photo);
    expect(response.body.data.dueDate).toEqual(dataWeeklyGoal.dueDate);
    expect(response.body.data.shareWith).toEqual(dataWeeklyGoal.shareWith);
  });
});

describe('POST /v1/posts/completeGoals', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create complete goals', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const resolution = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const dataWeeklyGoal = { categoryResolutionId: resolution.body.data.categoryResolutionId, caption: 'This week I want to get Rp 1.000.000', photo: ['linkphoto1.png'], dueDate: '2023-11-30T10:39:58.606Z', shareWith: 'everyone' };

    const weeklyGoals = await request(app).post('/v1/posts/weeklyGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataWeeklyGoal);

    const dataCompleteGoal = {
      categoryResolutionId: resolution.body.data.categoryResolutionId,
      weeklyGoalId: weeklyGoals.body.data._id,
      caption: 'I already completed this weekly goal.',
      photo: ['linkphoto1.png'],
      shareWith: 'everyone',
      isComplete: false,
    };

    const response = await request(app).post('/v1/posts/completeGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataCompleteGoal);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toEqual(dataCompleteGoal.categoryResolutionId);
    expect(response.body.data.weeklyGoalId).toEqual(dataCompleteGoal.weeklyGoalId);
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.categoryResolution).toBeDefined();
    expect(response.body.data.type).toEqual('completeGoals');
    expect(response.body.data.caption).toEqual(dataCompleteGoal.caption);
    expect(response.body.data.photo).toEqual(dataCompleteGoal.photo);
    expect(response.body.data.shareWith).toEqual(dataCompleteGoal.shareWith);
  });
});

describe('PATCH /v1/posts/:id/resolutions', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can update resolution', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const resolution = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).patch(`/v1/posts/${resolution.body.data._id}/resolutions`).set('Authorization', `Bearer ${currentUser.body.token}`).send({ caption: 'This is updated caption resolution' });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.type).toEqual('resolutions');
    expect(response.body.data.caption).toEqual('This is updated caption resolution');
    expect(response.body.data.photo).toEqual(dataPost.photo);
    expect(response.body.data.shareWith).toEqual(dataPost.shareWith);
  });
});

describe('PATCH /v1/posts/:id/weeklyGoals', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can update weekly goal', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const resolution = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const dataWeeklyGoal = { categoryResolutionId: resolution.body.data.categoryResolutionId, caption: 'This week I want to get Rp 1.000.000', photo: ['linkphoto1.png'], dueDate: '2023-11-30T10:39:58.606Z', shareWith: 'everyone' };

    const weeklyGoals = await request(app).post('/v1/posts/weeklyGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataWeeklyGoal);

    const response = await request(app).patch(`/v1/posts/${weeklyGoals.body.data._id}/weeklyGoals`).set('Authorization', `Bearer ${currentUser.body.token}`).send({ caption: 'This is updated caption weekly goal', shareWith: 'private' });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.categoryResolution).toBeDefined();
    expect(response.body.data.type).toEqual('weeklyGoals');
    expect(response.body.data.caption).toEqual('This is updated caption weekly goal');
    expect(response.body.data.photo).toEqual(dataWeeklyGoal.photo);
    expect(response.body.data.shareWith).toEqual('private');
  });
});

describe('PATCH /v1/posts/:id/completeGoals', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can update complete goals', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const resolution = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const dataWeeklyGoal = { categoryResolutionId: resolution.body.data.categoryResolutionId, caption: 'This week I want to get Rp 1.000.000', photo: ['linkphoto1.png'], dueDate: '2023-11-30T10:39:58.606Z', shareWith: 'everyone' };

    const weeklyGoals = await request(app).post('/v1/posts/weeklyGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataWeeklyGoal);

    const dataCompleteGoal = {
      categoryResolutionId: resolution.body.data.categoryResolutionId,
      weeklyGoalId: weeklyGoals.body.data._id,
      caption: 'I already completed this weekly goal.',
      photo: ['linkphoto1.png'],
      shareWith: 'everyone',
      isComplete: false,
    };

    const completeGoal = await request(app).post('/v1/posts/completeGoals').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataCompleteGoal);

    const response = await request(app)
      .patch(`/v1/posts/${completeGoal.body.data._id}/completeGoals`)
      .set('Authorization', `Bearer ${currentUser.body.token}`)
      .send({ caption: 'This is updated caption complete goal.', shareWith: 'private' });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.userId).toBeDefined();
    expect(response.body.data.categoryResolutionId).toBeDefined();
    expect(response.body.data.weeklyGoalId).toBeDefined();
    expect(response.body.data.userInfo).toBeDefined();
    expect(response.body.data.userInfo.categoryResolution).toBeDefined();
    expect(response.body.data.type).toEqual('completeGoals');
    expect(response.body.data.caption).toEqual('This is updated caption complete goal.');
    expect(response.body.data.photo).toEqual(dataCompleteGoal.photo);
    expect(response.body.data.shareWith).toEqual('private');
  });
});

describe('POST /v1/posts/like', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can like post', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const post = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).post('/v1/posts/like').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: post.body.data._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Post liked successfully.');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.likeCount).toEqual(1);
  });
});

describe('POST /v1/posts/unlike', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can unlike post', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const post = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    await request(app).post('/v1/posts/like').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: post.body.data._id });

    const response = await request(app).post('/v1/posts/unlike').set('Authorization', `Bearer ${currentUser.body.token}`).send({ postId: post.body.data._id });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.message).toEqual('Post unliked successfully.');
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.likeCount).toEqual(0);
  });
});

describe('DELETE /v1/posts/:id', () => {
  afterEach(async () => {
    await deleteAllUsers();
    await deleteAllNotifications();
    await deleteAllComments();
    await deleteAllPosts();
  });

  it('should can create one resolution', async () => {
    const currentUser = await register();

    const dataPost = {
      categoryName: 'Finance',
      caption: 'I want to get Rp 30.000.000',
      photo: ['linkphoto1.png'],
      dueDate: '2024-10-25T10:39:58.606Z',
      shareWith: 'everyone',
    };

    const post = await request(app).post('/v1/posts/resolutions').set('Authorization', `Bearer ${currentUser.body.token}`).send(dataPost);

    const response = await request(app).delete(`/v1/posts/${post.body.data._id}`).set('Authorization', `Bearer ${currentUser.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });
});
