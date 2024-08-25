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
const users_entity_1 = require("../../entities/users.entity");
const error_middleware_1 = require("../../middleware/error.middleware");
class UpdateCurrentUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, data) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            let userNow = yield this.userRepository.readOne(id);
            if (!userNow) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
            }
            if (typeof data.isPublic === 'string') {
                data.isPublic = data.isPublic === 'true';
            }
            if (userNow.photo && data.photo) {
                // ImageService.remove(userNow.photo);
            }
            const userEntity = new users_entity_1.UserEntity({
                email: userNow.email,
                username: (_a = data.username) !== null && _a !== void 0 ? _a : userNow.username,
                password: userNow.password,
                fullname: (_b = data.fullname) !== null && _b !== void 0 ? _b : userNow.fullname,
                bio: (_d = (_c = data.bio) !== null && _c !== void 0 ? _c : userNow.bio) !== null && _d !== void 0 ? _d : '',
                photo: (_e = data.photo) !== null && _e !== void 0 ? _e : userNow.photo,
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
                isPublic: (_f = data.isPublic) !== null && _f !== void 0 ? _f : userNow.isPublic,
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
exports.default = UpdateCurrentUserService;
