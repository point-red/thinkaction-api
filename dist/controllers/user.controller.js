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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const image_service_1 = require("../services/images/image.service");
dotenv_1.default.config();
class UserController {
    constructor(createUserService, updateMyPasswordUserService, getOneUserService, getAllSupporterService, getAllSupportingService, getCurrentUserRequestService, getCurrentUserNotificationService, updateCurrentUserService, supportAnotherUserService, unsupportAnotherUserService, acceptSupportRequestService, rejectSupportRequestService, searchUserService, getHistoryService, deleteHistoryService, getImageService) {
        this.createUserService = createUserService;
        this.updateMyPasswordUserService = updateMyPasswordUserService;
        this.getOneUserService = getOneUserService;
        this.getAllSupporterService = getAllSupporterService;
        this.getAllSupportingService = getAllSupportingService;
        this.getCurrentUserRequestService = getCurrentUserRequestService;
        this.getCurrentUserNotificationService = getCurrentUserNotificationService;
        this.updateCurrentUserService = updateCurrentUserService;
        this.supportAnotherUserService = supportAnotherUserService;
        this.unsupportAnotherUserService = unsupportAnotherUserService;
        this.acceptSupportRequestService = acceptSupportRequestService;
        this.rejectSupportRequestService = rejectSupportRequestService;
        this.searchUserService = searchUserService;
        this.getHistoryService = getHistoryService;
        this.deleteHistoryService = deleteHistoryService;
        this.getImageService = getImageService;
    }
    getAuthUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json(req.userData);
            }
            catch (e) {
                next(e);
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const result = yield this.createUserService.handle(data);
                const payload = {
                    _id: result._id,
                    username: result.username,
                    email: result.email,
                };
                const secret = process.env.JWT_SECRET;
                const token = jsonwebtoken_1.default.sign(payload, secret, {
                    expiresIn: process.env.JWT_EXPIRES,
                });
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                return res.cookie('jwt-token', token, cookieOptions).status(200).json({ status: 'success', token: token, data: { user: result } });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateMyPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userData._id;
                const result = yield this.updateMyPasswordUserService.handle(id, req.body);
                const payload = {
                    _id: result._id,
                    username: result.username,
                    email: result.email,
                };
                const secret = process.env.JWT_SECRET;
                const token = jsonwebtoken_1.default.sign(payload, secret, {
                    expiresIn: process.env.JWT_EXPIRES,
                });
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                return res.status(200).json({ status: 'success', token: token, data: { user: result } });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getOneUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const result = yield this.getOneUserService.handle(id, authUserId);
                // result.photo = await this.getImageService.handle(result.photo)
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllSupporter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const { page, limit, username } = req.query;
                const result = yield this.getAllSupporterService.handle(id, authUserId, page, limit, username || '');
                return res.status(200).json({ status: 'success', limit, page, results: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getAllSupporting(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const authUserId = req.userData._id;
                const { page, limit, username } = req.query;
                const result = yield this.getAllSupportingService.handle(id, authUserId, page, limit, username || '');
                return res.status(200).json({ status: 'success', limit, page, results: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getCurrentUserRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const { page, limit } = req.body;
                const result = yield this.getCurrentUserRequestService.handle(authUserId, page, limit);
                return res.status(200).json({ status: 'success', limit: +limit, page: +page, results: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getCurrentUserNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getCurrentUserNotificationService.handle(authUserId);
                let totalLength = 0;
                for (let key in result) {
                    if (Array.isArray(result[key])) {
                        totalLength += result[key].length;
                    }
                }
                return res.status(200).json({ status: 'success', limit: 20, results: totalLength, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateCurrentUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userData._id;
                const data = req.body;
                const photos = yield image_service_1.ImageService.move(req.file);
                data.photo = photos === null || photos === void 0 ? void 0 : photos[0];
                let result = yield this.updateCurrentUserService.handle(id, data);
                // result.photo = await this.getImageService.handle(result.photo)
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    supportAnotherUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const authUserId = req.userData._id;
                const result = yield this.supportAnotherUserService.handle(userId, authUserId);
                return res.status(200).json({ status: 'success', message: result.isPublic ? 'User is now supported' : 'Support request sent successfully', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    unsupportAnotherUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const authUserId = req.userData._id;
                const result = yield this.unsupportAnotherUserService.handle(userId, authUserId);
                return res.status(200).json({ status: 'success', message: 'User is now unsupported', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    acceptSupportRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, notificationId } = req.body;
                const authUserId = req.userData._id;
                const result = yield this.acceptSupportRequestService.handle(userId, authUserId, notificationId);
                return res.status(200).json({ status: 'success', message: 'Support request accepted successfully', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    rejectSupportRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const authUserId = req.userData._id;
                const result = yield this.rejectSupportRequestService.handle(userId, authUserId);
                return res.status(200).json({ status: 'success', message: 'Support request rejected successfully', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    searchUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.query;
                const authUserId = req.userData._id;
                const result = yield this.searchUserService.handle(username, authUserId);
                return res.status(200).json({ status: 'success', results: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getHistoryService.handle(authUserId);
                return res.status(200).json({ status: 'success', results: result.length, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                yield this.deleteHistoryService.handle(authUserId);
                return res.status(204).json({});
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = UserController;
