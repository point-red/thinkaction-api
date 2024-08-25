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
const mongodb_1 = require("mongodb");
const error_middleware_1 = require("../../middleware/error.middleware");
class DeleteCommentService {
    constructor(commentRepository, postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }
    handle(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.readOne(id);
            if (!comment) {
                throw new error_middleware_1.ResponseError(404, 'Comment is not found');
            }
            if (comment.userId.toString() !== authUserId) {
                throw new error_middleware_1.ResponseError(400, 'Cannot delete comment, This is not your comment.');
            }
            if (comment.type === 'reply') {
                const pipeline = [
                    {
                        $match: {
                            reply: {
                                $elemMatch: {
                                    $eq: new mongodb_1.ObjectId(id),
                                },
                            },
                        },
                    },
                ];
                let parentId = yield this.commentRepository.aggregate(pipeline);
                parentId = parentId[0]._id.toString();
                yield this.commentRepository.update3(parentId, id);
            }
            else if (comment.type === 'comment') {
                comment.reply.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                    yield this.commentRepository.delete(data.toString());
                }));
            }
            yield this.postRepository.deleteCommentCount(comment.postId);
            return yield this.commentRepository.delete(id);
        });
    }
}
exports.default = DeleteCommentService;
