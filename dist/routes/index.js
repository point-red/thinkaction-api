"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users/users.routes"));
const comments_routes_1 = __importDefault(require("./comments/comments.routes"));
const notifications_routes_1 = __importDefault(require("./notifications/notifications.routes"));
const post_routes_1 = __importDefault(require("./posts/post.routes"));
const router = (0, express_1.Router)();
exports.router = router;
router.use('/users', users_routes_1.default);
router.use('/comments', comments_routes_1.default);
router.use('/notifications', notifications_routes_1.default);
router.use('/posts', post_routes_1.default);
