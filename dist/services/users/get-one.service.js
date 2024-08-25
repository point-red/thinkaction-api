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
class GetOneUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAuthenticatedUser = authUserId == id;
            const project = {
                _id: 1,
                fullname: 1,
                username: 1,
                email: 1,
                bio: 1,
                photo: 1,
                categoryResolution: 1,
                isPublic: 1,
                supporterCount: 1,
                supportingCount: 1,
                goalsPerformance: 1,
                isAuthenticatedUser: 1,
                isSupporting: 1,
            };
            if (isAuthenticatedUser) {
                project.notificationCount = 1;
                project.requestCount = 1;
            }
            const pipeline = [
                { $match: { _id: new mongodb_1.ObjectId(id) } },
                {
                    $addFields: Object.assign({ isAuthenticatedUser }, (isAuthenticatedUser
                        ? {}
                        : {
                            isSupporting: {
                                $in: [new mongodb_1.ObjectId(authUserId), '$supporter'],
                            },
                        })),
                },
                {
                    $project: project,
                },
            ];
            const result = yield this.userRepository.aggregate(pipeline);
            return result[0];
        });
    }
}
exports.default = GetOneUserService;
