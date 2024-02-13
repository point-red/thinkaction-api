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
class GetHistoryService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    handle(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: { _id: new mongodb_1.ObjectId(authUserId) },
                },
                {
                    $project: {
                        historyAccount: { $slice: ['$historyAccount', -5] },
                    },
                },
                {
                    $unwind: '$historyAccount',
                },
                {
                    $replaceRoot: { newRoot: '$historyAccount' },
                },
            ];
            const result = (yield this.userRepository.aggregate(pipeline)).reverse();
            return result;
        });
    }
}
exports.default = GetHistoryService;
