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
class GetAllLikePostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(idPost, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authId = new mongodb_1.ObjectId(authUserId);
            const pipeline = [
                {
                    $match: { _id: new mongodb_1.ObjectId(idPost) },
                },
                { $unwind: '$like' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'like',
                        foreignField: '_id',
                        as: 'userInfo',
                    },
                },
                { $unwind: '$userInfo' },
                {
                    $replaceRoot: { newRoot: '$userInfo' },
                },
                {
                    $addFields: {
                        isSupporting: {
                            $in: [authId, '$supporter'],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        fullname: 1,
                        username: 1,
                        email: 1,
                        bio: 1,
                        supportingCount: 1,
                        supporterCount: 1,
                        photo: 1,
                        categoryResolution: 1,
                        isSupporting: 1,
                        isPublic: 1,
                    },
                },
                { $limit: 10 },
            ];
            const allPost = yield this.postRepository.aggregate(pipeline);
            return allPost;
        });
    }
}
exports.default = GetAllLikePostService;
