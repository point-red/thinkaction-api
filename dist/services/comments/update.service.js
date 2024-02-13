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
const comments_entity_1 = require("../../entities/comments.entity");
const error_middleware_1 = require("../../middleware/error.middleware");
const user_repository_1 = require("../../repositories/user.repository");
class UpdateCommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    handle(data, id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.readOne(id);
            if (!comment) {
                throw new error_middleware_1.ResponseError(400, 'Comment not found');
            }
            if (comment.userId.toString() !== authUserId) {
                throw new error_middleware_1.ResponseError(400, 'Cannot update comment, This is not your comment.');
            }
            const commentEntity = new comments_entity_1.CommentEntity({
                _id: comment._id,
                userId: comment.userId,
                postId: comment.postId,
                message: data.message,
                reply: comment.reply,
                replyCount: comment.replyCount,
                type: comment.type,
                createdDate: comment.createdDate,
                updatedDate: new Date(),
                isUpdating: true,
            });
            let commentData = commentEntity.CheckData();
            yield this.commentRepository.update2(id, commentData);
            const dataComment = yield this.commentRepository.readOne(id);
            const userRepository = new user_repository_1.UserRepository();
            const userData = yield userRepository.readOne(comment.userId);
            return {
                _id: dataComment._id,
                postId: dataComment.postId,
                userId: dataComment.userId,
                userInfo: {
                    _id: id,
                    username: userData.username,
                    photo: userData.photo,
                },
                message: dataComment.message,
                type: dataComment.type,
                replyCount: dataComment.replyCount,
                createdDate: dataComment.createdDate.toISOString(),
                updatedDate: dataComment.updatedDate.toISOString(),
            };
        });
    }
}
exports.default = UpdateCommentService;
