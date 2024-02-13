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
class GetAllReplyService {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    handle(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: { _id: new mongodb_1.ObjectId(commentId) },
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: 'reply',
                        foreignField: '_id',
                        as: 'dataReply',
                    },
                },
                { $unwind: '$dataReply' },
                {
                    $replaceRoot: { newRoot: '$dataReply' },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        postId: 1,
                        userId: 1,
                        'userInfo._id': 1,
                        'userInfo.username': 1,
                        'userInfo.photo': 1,
                        message: 1,
                        replyCount: 1,
                        type: 1,
                        updatedDate: 1,
                        createdDate: 1,
                    },
                },
            ];
            const getAllReply = yield this.commentRepository.aggregate(pipeline);
            return getAllReply;
        });
    }
}
exports.default = GetAllReplyService;
