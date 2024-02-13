import { Router } from 'express';
import userApi from './users/users.routes';
import commentApi from './comments/comments.routes';
import notifApi from './notifications/notifications.routes';
import postApi from './posts/post.routes';

const router = Router();

router.use('/users', userApi);
router.use('/comments', commentApi);
router.use('/notifications', notifApi);
router.use('/posts', postApi);

export { router };
