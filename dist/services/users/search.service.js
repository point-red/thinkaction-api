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
class SearchUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(username, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUser = yield this.userRepository.readOne(authUserId);
            const supportingIds = authUser.supporting;
            const pipeline = [
                {
                    $match: {
                        username: { $regex: new RegExp('.*' + username + '.*', 'i') },
                    },
                },
                {
                    $limit: 5,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'supporter',
                        foreignField: '_id',
                        as: 'supportedByDetails',
                    },
                },
                {
                    $addFields: {
                        supportedByCount: { $size: '$supportedByDetails' },
                        supportedBy: {
                            $map: {
                                input: '$supportedByDetails',
                                as: 'detail',
                                in: {
                                    _id: '$$detail._id',
                                    username: '$$detail.username',
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        fullname: 1,
                        username: 1,
                        photo: 1,
                        supportedByCount: 1,
                        supportedBy: 1,
                    },
                },
            ];
            const data = yield this.userRepository.aggregate(pipeline);
            yield this.userRepository.updateOne8(data, authUserId);
            return data;
        });
    }
}
exports.default = SearchUserService;
