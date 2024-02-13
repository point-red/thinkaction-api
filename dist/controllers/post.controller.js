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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PostController {
    constructor(getAllPostService, getOnePostService, getAllLikePostService, createResolutionService, createWeeklyGoalsService, createCompleteGoalsService, updateResolutionsService, updateWeeklyGoalsService, updateCompleteGoalsService, likePostService, unlikePostService, getMonthlyReportService, deletePostService) {
        this.createResolutionService = createResolutionService;
        this.createWeeklyGoalsService = createWeeklyGoalsService;
        this.createCompleteGoalsService = createCompleteGoalsService;
        this.updateResolutionsService = updateResolutionsService;
        this.updateWeeklyGoalsService = updateWeeklyGoalsService;
        this.updateCompleteGoalsService = updateCompleteGoalsService;
        this.likePostService = likePostService;
        this.unlikePostService = unlikePostService;
        this.deletePostService = deletePostService;
        this.getAllPostService = getAllPostService;
        this.getOnePostService = getOnePostService;
        this.getAllLikePostService = getAllLikePostService;
        this.getMonthlyReportService = getMonthlyReportService;
    }
    getAllPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.getAllPostService.handle(req.body);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getOnePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.getOnePostService.handle(id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllLikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.getAllLikePostService.handle(id, authUserId);
                return res.status(200).json({ status: 'success', likeCount: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createResolution(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.createResolutionService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createWeeklyGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.createWeeklyGoalsService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createCompleteGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.createCompleteGoalsService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateResolutions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const result = yield this.updateResolutionsService.handle(req.body, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateWeeklyGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const result = yield this.updateWeeklyGoalsService.handle(req.body, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateCompleteGoals(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { id } = req.params;
                const result = yield this.updateCompleteGoalsService.handle(req.body, authUserId, id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    likePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.likePostService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', message: 'Post liked successfully.', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    unlikePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.unlikePostService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', message: 'Post unliked successfully.', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getMonthlyReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getMonthlyReportService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.deletePostService.handle(id);
                return res.status(200).json({});
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = PostController;
