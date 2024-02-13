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
class UnlikePostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusLike = yield this.postRepository.readOne(data.postId);
            const alreadyLike = statusLike.like.find((like) => like.toString() == authUserId);
            if (!alreadyLike) {
                throw new error_middleware_1.ResponseError(400, "You don't like it yet");
            }
            yield this.postRepository.update3(data.postId, authUserId);
            let post = yield this.postRepository.readOne(data.postId);
            return {
                _id: data.postId,
                likeCount: post.likeCount,
            };
        });
    }
}
exports.default = UnlikePostService;
