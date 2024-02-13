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
class UnsupportAnotherUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToUnsupport = yield this.userRepository.findOne3(id, authUserId);
            if (!userToUnsupport) {
                throw new error_middleware_1.ResponseError(400, 'User not found or not supported');
            }
            yield this.userRepository.updateOne4(id, authUserId);
            yield this.userRepository.updateOne5(id, authUserId);
            const updatedUser = yield this.userRepository.findOne2(id);
            return updatedUser;
        });
    }
}
exports.default = UnsupportAnotherUserService;
