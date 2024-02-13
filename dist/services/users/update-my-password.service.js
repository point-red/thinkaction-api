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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_entity_1 = require("../../entities/users.entity");
const error_middleware_1 = require("../../middleware/error.middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UpdateMyPasswordUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let userNow = yield this.userRepository.readOne(id);
            if (!userNow) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
            }
            const passwordMatch = yield bcrypt_1.default.compare(data.passwordCurrent, userNow.password);
            if (!passwordMatch) {
                throw new error_middleware_1.ResponseError(400, 'Current password is wrong');
            }
            const hashedPass = yield bcrypt_1.default.hash(data.passwordNew, 12);
            const userEntity = new users_entity_1.UserEntity({
                email: userNow.email,
                username: userNow.username,
                password: hashedPass,
                fullname: userNow.fullname,
                bio: userNow.bio,
                photo: userNow.photo,
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
                isPublic: userNow.isPublic,
                isUpdating: userNow.isUpdating,
            });
            let userData = userEntity.CheckData();
            yield this.userRepository.update(id, userData);
            const dataUser = yield this.userRepository.readOne(id);
            if (!dataUser) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
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
        });
    }
}
exports.default = UpdateMyPasswordUserService;
