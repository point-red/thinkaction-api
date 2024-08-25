"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const user_repository_1 = require("../../repositories/user.repository");
const create_service_1 = __importDefault(require("../../services/users/create.service"));
const router = (0, express_1.Router)();
const userRepository = new user_repository_1.UserRepository();
const createUserService = new create_service_1.default(userRepository);
const authController = new auth_controller_1.default(createUserService, userRepository);
router.post("/oauth-callback", (req, res, next) => authController.googleOauthCallback(req, res, next));
exports.default = router;
