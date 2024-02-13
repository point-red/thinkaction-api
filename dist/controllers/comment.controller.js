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
class CommentController {
    constructor(getAllCommentService, getAllReplyService, createCommentService, createReplyCommentService, updateCommentService, deleteCommentService) {
        this.createCommentService = createCommentService;
        this.createReplyCommentService = createReplyCommentService;
        this.updateCommentService = updateCommentService;
        this.deleteCommentService = deleteCommentService;
        this.getAllCommentService = getAllCommentService;
        this.getAllReplyService = getAllReplyService;
    }
    getAllComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const result = yield this.getAllCommentService.handle(postId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.getAllReplyService.handle(id);
                return res.status(200).json({ status: 'success', replyCount: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.createCommentService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    createReplyComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.createReplyCommentService.handle(req.body, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.updateCommentService.handle(req.body, id, authUserId);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.deleteCommentService.handle(id, authUserId);
                return res.status(200).json({});
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = CommentController;
