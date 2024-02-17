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
const user_repository_1 = require("../../repositories/user.repository");
class GetMonthlyReportService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(data.year, data.month - 1, 1);
            const endDate = new Date(data.year, data.month, 0);
            const pipeline = [
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(authUserId),
                    },
                },
                {
                    $unwind: '$categoryResolution',
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'categoryResolution._id',
                        foreignField: 'categoryResolutionId',
                        as: 'postsData',
                    },
                },
                {
                    $addFields: {
                        postsData: {
                            $filter: {
                                input: '$postsData',
                                as: 'post',
                                cond: { $eq: ['$$post.type', 'resolutions'] },
                            },
                        },
                    },
                },
                {
                    $unwind: '$postsData',
                },
                {
                    $project: {
                        _id: 1,
                        categoryResolution: {
                            $mergeObjects: ['$categoryResolution', { updatedDate: '$postsData.updatedDate' }],
                        },
                    },
                },
                {
                    $match: {
                        $and: [{ 'categoryResolution.createdDate': { $gte: startDate } }, { 'categoryResolution.createdDate': { $lte: endDate } }],
                    },
                },
            ];
            const userRepository = new user_repository_1.UserRepository();
            const allPost = yield userRepository.aggregate(pipeline);
            function getWeeksInMonth(year, month, allPost) {
                const weeks = {};
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                let currentDate = new Date(startDate);
                let weekNumber = 1;
                while (currentDate <= endDate) {
                    const startOfWeek = new Date(currentDate);
                    const endOfWeek = new Date(currentDate);
                    endOfWeek.setDate(endOfWeek.getDate() + 6);
                    const weekObj = {};
                    allPost.forEach((item) => {
                        const categoryResolutionName = item.categoryResolution.name;
                        if (item.categoryResolution.isComplete === true && item.categoryResolution.updatedDate <= endOfWeek) {
                            weekObj[categoryResolutionName] = true;
                            weekObj['startDate'] = startOfWeek;
                            weekObj['endDate'] = endOfWeek;
                        }
                        else {
                            weekObj[categoryResolutionName] = false;
                            weekObj['startDate'] = startOfWeek;
                            weekObj['endDate'] = endOfWeek;
                        }
                    });
                    weeks['week' + weekNumber] = weekObj;
                    currentDate.setDate(currentDate.getDate() + 7);
                    weekNumber++;
                }
                return weeks;
            }
            const weeksInMonth = getWeeksInMonth(data.year, data.month, allPost);
            console.log(weeksInMonth);
            return weeksInMonth;
        });
    }
}
exports.default = GetMonthlyReportService;
