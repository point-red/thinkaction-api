"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_middleware_1 = require("../../middleware/error.middleware");
const notification_repository_1 = require("../../repositories/notification.repository");
class SupportAnotherUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = new notification_repository_1.NotificationRepository();
            const userToSupport = yield this.userRepository.findOne1(id, authUserId);
            if (id === authUserId) {
                throw new error_middleware_1.ResponseError(400, "Can't support current user");
            }
            const authUser = yield this.userRepository.readOne(authUserId);
            if (!authUser) {
                throw new error_middleware_1.ResponseError(400, 'User is not found');
            }
            if (!userToSupport) {
                throw new error_middleware_1.ResponseError(400, 'User not found or already supported');
            }
            if (userToSupport.isPublic) {
                const notification = yield notificationRepository.create({
                    type: 'message',
                    message: `${authUser.username} has supported you`,
                    date: new Date(),
                });
                const notificationId = notification.insertedId;
                yield this.userRepository.updateOne(id, authUserId, notificationId);
                yield this.userRepository.updateOne2(id, authUserId);
            }
            else {
                const notification = yield notificationRepository.create({
                    type: 'request',
                    message: `${authUser.username} wants to support you`,
                    status: 'pending',
                    date: new Date(),
                });
                const notificationId = notification.insertedId;
                yield this.userRepository.updateOne3(id, authUserId, notificationId);
            }
            const updatedUser = yield this.userRepository.findOne2(id);
            return updatedUser;
        });
    }
}
exports.default = SupportAnotherUserService;
