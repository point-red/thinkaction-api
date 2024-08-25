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
class GetAllNotificationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                { $match: { _id: new mongodb_1.ObjectId(id) } },
                { $unwind: '$notification' },
                {
                    $lookup: {
                        from: 'notifications',
                        localField: 'notification',
                        foreignField: '_id',
                        as: 'notificationData',
                    },
                },
                { $unwind: '$notificationData' },
                {
                    $project: {
                        _id: '$notificationData._id',
                        type: '$notificationData.type',
                        fromUserId: '$notificationData.fromUserId',
                        message: '$notificationData.message',
                        date: '$notificationData.date',
                        status: '$notificationData.status',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'fromUserId',
                        foreignField: '_id',
                        as: 'fromUser'
                    }
                },
                {
                    $unwind: {
                        path: '$fromUser',
                    }
                },
                {
                    $addFields: {
                        'fromUser.isSupporting': {
                            $in: [new mongodb_1.ObjectId(id), '$fromUser.supporter']
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        type: 1,
                        message: 1,
                        fromUserId: 1,
                        status: 1,
                        fromUser: {
                            id: 1,
                            username: 1,
                            photo: 1,
                            isSupporting: 1,
                            isPublic: 1,
                        },
                    }
                },
                { $limit: 10 },
            ];
            const data = yield this.userRepository.aggregate(pipeline);
            return data;
        });
    }
}
exports.default = GetAllNotificationService;
