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
const notification_repository_1 = require("../../repositories/notification.repository");
const mongodb_1 = require("mongodb");
class GetCurrentUserNotificationService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.readOne(authUserId);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const thisWeek = new Date(today);
            thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const pipeline = [
                { $match: { _id: { $in: user.notification.map((id) => new mongodb_1.ObjectId(id)) } } },
                { $limit: 20 },
                {
                    $addFields: {
                        category: {
                            $switch: {
                                branches: [
                                    { case: { $gte: ['$date', today] }, then: 'today' },
                                    { case: { $gte: ['$date', yesterday] }, then: 'yesterday' },
                                    { case: { $gte: ['$date', thisWeek] }, then: 'thisWeek' },
                                    { case: { $gte: ['$date', thisMonth] }, then: 'thisMonth' },
                                ],
                                default: 'older',
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: '$category',
                        notifications: { $push: '$$ROOT' },
                    },
                },
                {
                    $project: {
                        category: '$_id',
                        notifications: 1,
                    },
                },
            ];
            const notificationRepository = new notification_repository_1.NotificationRepository();
            const categorizedNotifications = yield notificationRepository.aggregate(pipeline);
            const data = categorizedNotifications.reduce((acc, curr) => {
                acc[curr._id] = curr.notifications;
                return acc;
            }, {});
            return data;
        });
    }
}
exports.default = GetCurrentUserNotificationService;
