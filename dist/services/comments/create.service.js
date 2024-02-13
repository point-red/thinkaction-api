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
const mongodb_1 = require("mongodb");
class CreateCommentService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    handle(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentEntity = new comments_entity_1.CommentEntity({
                userId: new mongodb_1.ObjectId(id),
                postId: new mongodb_1.ObjectId(data.postId),
                message: data.message,
                reply: [],
                replyCount: 0,
                type: 'comment',
                createdDate: new Date(),
                isUpdating: data.isUpdating || false,
            });
            let commentData = commentEntity.CheckData();
            let comment = yield this.commentRepository.create(commentData);
            const dataComment = yield this.commentRepository.readOne(comment.insertedId.toString());
            if (!dataComment) {
                throw new error_middleware_1.ResponseError(404, 'Comment not found');
            }
            const userRepository = new user_repository_1.UserRepository();
            const userData = yield userRepository.readOne(id);
            if (!userData) {
                throw new error_middleware_1.ResponseError(404, 'User not found');
            }
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
                updatedDate: dataComment.updatedDate ? dataComment.updatedDate.toISOString() : null,
            };
        });
    }
}
exports.default = CreateCommentService;
