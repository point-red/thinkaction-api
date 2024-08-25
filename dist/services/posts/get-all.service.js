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
// import GetImageService from '../images/get-image.service';
class GetAllPostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(authUserId, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $ne: [data.userId, null] },
                                then: { $eq: ['$userId', new mongodb_1.ObjectId(data.userId)] },
                                else: true,
                            },
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $ne: [data.startDate, null] },
                                then: { $gte: ['$createdDate', { $toDate: data.startDate }] },
                                else: true,
                            },
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $ne: [data.endDate, null] },
                                then: { $lte: ['$createdDate', { $toDate: data.endDate }] },
                                else: true,
                            },
                        },
                    },
                },
                {
                    $match: {
                        $expr: {
                            $cond: {
                                if: { $ne: [data.categoryResolutionId, null] },
                                then: { $eq: ['$categoryResolutionId', new mongodb_1.ObjectId(data.categoryResolutionId)] },
                                else: true,
                            },
                        },
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
                        likedByCurrent: new mongodb_1.ObjectId(authUserId)
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
                        likedByCurrent: 1,
                        commentCount: 1,
                        dueDate: 1,
                        createdDate: 1,
                        updatedDate: 1,
                        shareWith: 1,
                        isComplete: 1,
                        userInfo: {
                            _id: 1,
                            username: 1,
                            fullname: 1,
                            photo: 1,
                            resolution: 1,
                            categoryResolution: 1,
                        },
                    },
                },
                {
                    $facet: {
                        metadata: [{ $count: 'totalCount' }],
                        data: [{ $skip: (Number(data.page) - 1) * Number(data.limit) }, { $limit: Number(data.limit) }],
                    },
                },
            ];
            if (data.sort && data.order) {
                const sortField = data.sort;
                const sortOrder = data.order === 'asc' ? 1 : -1;
                const sortStage = {
                    $sort: {
                        [sortField]: sortOrder,
                    },
                };
                pipeline.push(sortStage);
            }
            else if (!data.sort && data.order) {
                const sortOrder = data.order === 'asc' ? 1 : -1;
                const sortStage = {
                    $sort: {
                        createdDate: sortOrder,
                    },
                };
                pipeline.push(sortStage);
            }
            else {
                const sortStage = {
                    $sort: {
                        createdDate: -1,
                    },
                };
                pipeline.push(sortStage);
            }
            const allPost = yield this.postRepository.aggregate(pipeline);
            return {
                total: (_b = (_a = allPost[0].metadata[0]) === null || _a === void 0 ? void 0 : _a.totalCount) !== null && _b !== void 0 ? _b : 0,
                page: Number(data.page),
                limit: Number(data.limit),
                data: allPost[0].data
            };
        });
    }
}
exports.default = GetAllPostService;
