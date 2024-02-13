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
const user_repository_1 = require("../../repositories/user.repository");
class DeleteNotificationService {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    handle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.notificationRepository.readOne(id);
            if (!notification) {
                throw new error_middleware_1.ResponseError(404, 'notification is not found');
            }
            yield this.notificationRepository.delete(id);
            const userRepository = new user_repository_1.UserRepository();
            return yield userRepository.updateOne10(id);
        });
    }
}
exports.default = DeleteNotificationService;
