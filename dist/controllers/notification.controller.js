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
class NotificationController {
    constructor(getAllNotificationService, getOneNotificationService, deleteNotificationService) {
        this.getAllNotificationService = getAllNotificationService;
        this.getOneNotificationService = getOneNotificationService;
        this.deleteNotificationService = deleteNotificationService;
    }
    getAllNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authUserId = req.userData._id;
                const result = yield this.getAllNotificationService.handle(authUserId);
                return res.status(200).json({ status: 'success', limit: 10, page: 1, data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    getOneNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.getOneNotificationService.handle(id);
                return res.status(200).json({ status: 'success', data: result });
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.deleteNotificationService.handle(id);
                return res.status(200).json({});
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = NotificationController;
