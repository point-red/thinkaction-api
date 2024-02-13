import { Router } from 'express';
import CreateUserService from '../../services/users/create.service';
import GetOneUserService from '../../services/users/get-one.service';
import GetAllSupporterService from '../../services/users/get-all-supporter.service';
import SupportAnotherUserService from '../../services/users/support-another.service';
import UserController from '../../controllers/user.controller';
import { UserRepository } from '../../repositories/user.repository';
import AuthController from '../../controllers/auth.controller';
import { verifyUser } from '../../middleware/auth.middleware';
import UpdateMyPasswordUserService from '../../services/users/update-my-password.service';
import GetAllSupportingService from '../../services/users/get-all-supporting.service';
import GetCurrentUserRequestService from '../../services/users/get-current-user-request.service';
import GetCurrentUserNotificationService from '../../services/users/get-current-user-notification.service';
import UpdateCurrentUserService from '../../services/users/update-current-user.service';
import UnsupportAnotherUserService from '../../services/users/unsupport-another.service';
import AcceptSupportRequestService from '../../services/users/accept-support-request.service';
import RejectSupportRequestService from '../../services/users/reject-support-request.service';
import SearchUserService from '../../services/users/search.service';
import GetHistoryService from '../../services/users/get-history.service';
import DeleteHistoryService from '../../services/users/delete-history.service';

const router = Router();
const userRepository = new UserRepository();
const createUser = new CreateUserService(userRepository);
const updateMyPasswordUser = new UpdateMyPasswordUserService(userRepository);
const getOneUser = new GetOneUserService(userRepository);
const getAllSupporter = new GetAllSupporterService(userRepository);
const getAllSupporting = new GetAllSupportingService(userRepository);
const getCurrentUserRequest = new GetCurrentUserRequestService(userRepository);
const getCurrentUserNotification = new GetCurrentUserNotificationService(userRepository);
const updateCurrentUser = new UpdateCurrentUserService(userRepository);
const supportAnotherUser = new SupportAnotherUserService(userRepository);
const unsupportAnotherUser = new UnsupportAnotherUserService(userRepository);
const acceptSupportRequest = new AcceptSupportRequestService(userRepository);
const rejectSupportRequest = new RejectSupportRequestService(userRepository);
const searchUser = new SearchUserService(userRepository);
const getHistory = new GetHistoryService(userRepository);
const deleteHistory = new DeleteHistoryService(userRepository);
const userController = new UserController(
  createUser,
  updateMyPasswordUser,
  getOneUser,
  getAllSupporter,
  getAllSupporting,
  getCurrentUserRequest,
  getCurrentUserNotification,
  updateCurrentUser,
  supportAnotherUser,
  unsupportAnotherUser,
  acceptSupportRequest,
  rejectSupportRequest,
  searchUser,
  getHistory,
  deleteHistory
);
const authController = new AuthController(userRepository);

router.post('/register', (req, res, next) => userController.createUser(req, res, next));

router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/support', verifyUser, (req, res, next) => userController.supportAnotherUser(req, res, next));

router.post('/unsupport', verifyUser, (req, res, next) => userController.unsupportAnotherUser(req, res, next));

router.post('/request/accept', verifyUser, (req, res, next) => userController.acceptSupportRequest(req, res, next));

router.post('/request/reject', verifyUser, (req, res, next) => userController.rejectSupportRequest(req, res, next));

router.patch('/updateMyPassword', verifyUser, (req, res, next) => userController.updateMyPassword(req, res, next));

router.get('/logout', (req, res, next) => authController.logout(req, res));

router.get('/request', verifyUser, (req, res, next) => userController.getCurrentUserRequest(req, res, next));

router.get('/notification', verifyUser, (req, res, next) => userController.getCurrentUserNotification(req, res, next));

router.get('/search', verifyUser, (req, res, next) => userController.searchUser(req, res, next));

router.get('/history', verifyUser, (req, res, next) => userController.getHistory(req, res, next));

router.get('/:id', verifyUser, (req, res, next) => userController.getOneUser(req, res, next));

router.get('/:id/supporter', verifyUser, (req, res, next) => userController.getAllSupporter(req, res, next));

router.get('/:id/supporting', verifyUser, (req, res, next) => userController.getAllSupporting(req, res, next));

router.patch('/', verifyUser, (req, res, next) => userController.updateCurrentUser(req, res, next));

router.delete('/history', verifyUser, (req, res, next) => userController.deleteHistory(req, res, next));

export default router;
