import { Router } from 'express';
import { verifyUser } from '../../middleware/auth.middleware';
import { UserRepository } from '../../repositories/user.repository';
import GetAllNotificationService from '../../services/notifications/get-all.service';
import NotificationController from '../../controllers/notification.controller';
import { NotificationRepository } from '../../repositories/notification.repository';
import GetOneNotificationService from '../../services/notifications/get-one.service';
import DeleteNotificationService from '../../services/notifications/delete.service';

const router = Router();
const userRepository = new UserRepository();
const notificationRepository = new NotificationRepository();
const getAllNotification = new GetAllNotificationService(userRepository);
const getOneNotification = new GetOneNotificationService(notificationRepository);
const deleteNotification = new DeleteNotificationService(notificationRepository);
const notificationController = new NotificationController(getAllNotification, getOneNotification, deleteNotification);

router.get('/', verifyUser, (req, res, next) => notificationController.getAllNotification(req, res, next));

router.get('/:id', verifyUser, (req, res, next) => notificationController.getOneNotification(req, res, next));

router.delete('/:id', verifyUser, (req, res, next) => notificationController.deleteNotification(req, res, next));

export default router;
