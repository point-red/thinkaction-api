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
class GetMonthlyReportService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(`${data.year}-0${data.month}-01`);
            const endDate = new Date(`${data.year}-0${data.month + 1}-01`);
            const pipeline = [
                {
                    $match: {
                        userId: new mongodb_1.ObjectId(authUserId),
                        createdDate: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                    },
                },
            ];
            const allPost = yield this.postRepository.aggregate(pipeline);
            return allPost;
        });
    }
}
exports.default = GetMonthlyReportService;
