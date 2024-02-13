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
class GetAllSupporterService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, authUserId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const pipeline = [
                { $match: { _id: new mongodb_1.ObjectId(id) } },
                { $unwind: '$supporter' },
                { $skip: +skip },
                { $limit: +limit },
                { $addFields: { isAuthenticatedUser: { $eq: [new mongodb_1.ObjectId(authUserId), '$_id'] } } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'supporter',
                        foreignField: '_id',
                        as: 'supporterDetails',
                    },
                },
                { $unwind: '$supporterDetails' },
                {
                    $addFields: {
                        'supporterDetails.isSupporting': {
                            $in: [new mongodb_1.ObjectId(authUserId), '$supporterDetails.supporter'],
                        },
                    },
                },
                {
                    $replaceRoot: { newRoot: '$supporterDetails' },
                },
                {
                    $project: {
                        fullname: 1,
                        username: 1,
                        email: 1,
                        bio: 1,
                        photo: 1,
                        categoryResolution: 1,
                        isPublic: 1,
                        supporterCount: 1,
                        supportingCount: 1,
                        isSupporting: 1,
                    },
                },
            ];
            const data = yield this.userRepository.aggregate(pipeline);
            return data.map((supporter) => (Object.assign(Object.assign({}, supporter), { isAuthenticatedUser: supporter._id.equals(new mongodb_1.ObjectId(authUserId)) })));
        });
    }
}
exports.default = GetAllSupporterService;
