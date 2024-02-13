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
class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.userRepository.getUserByEmail(data.email)) !== null) {
                throw new error_middleware_1.ResponseError(400, 'Email already registered');
            }
            const hashedPass = yield bcrypt_1.default.hash(data.password, 12);
            const userEntity = new users_entity_1.UserEntity({
                username: data.username,
                email: data.email,
                password: hashedPass,
                fullname: (_a = data.fullname) !== null && _a !== void 0 ? _a : null,
                bio: (_b = data.bio) !== null && _b !== void 0 ? _b : null,
                photo: (_c = data.photo) !== null && _c !== void 0 ? _c : null,
                supporter: [],
                supporting: [],
                request: [],
                notification: [],
                goalsPerformance: 0,
                supporterCount: 0,
                supportingCount: 0,
                requestCount: 0,
                notificationCount: 0,
                historyAccount: [],
                categoryResolution: [],
                isPublic: true,
            });
            let userData = userEntity.CheckData();
            let user = yield this.userRepository.create(userData);
            const dataUser = yield this.userRepository.readOne(user.insertedId.toString());
            if (!dataUser) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
            }
            return {
                _id: dataUser._id,
                username: dataUser.username,
                fullname: dataUser.fullname,
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
exports.default = CreateUserService;
