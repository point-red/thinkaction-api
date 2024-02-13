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
class GetOnePostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
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
                    $addFields: {
                        userInfo: {
                            $arrayElemAt: ['$userInfo', 0],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        categoryResolutionId: 1,
                        type: 1,
                        caption: 1,
                        photo: 1,
                        likeCount: 1,
                        commentCount: 1,
                        dueDate: 1,
                        createdDate: 1,
                        updatedDate: 1,
                        shareWith: 1,
                        isComplete: 1,
                        userInfo: {
                            _id: 1,
                            username: 1,
                            photo: 1,
                            resolution: 1,
                            categoryResolution: 1,
                        },
                    },
                },
            ];
            const onePost = yield this.postRepository.aggregate(pipeline);
            return onePost[0];
        });
    }
}
exports.default = GetOnePostService;
