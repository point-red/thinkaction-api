import { Router } from 'express';
import authApi from './auth/auth.routes';
import userApi from './users/users.routes';
import commentApi from './comments/comments.routes';
import notifApi from './notifications/notifications.routes';
import postApi from './posts/post.routes';
import imageApi from './images/image.routes';

const router = Router();

router.use('/auth', authApi);
router.use('/users', userApi);
router.use('/comments', commentApi);
router.use('/notifications', notifApi);
router.use('/posts', postApi);
router.use('/images', imageApi)

export { router };
