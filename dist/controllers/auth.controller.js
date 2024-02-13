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
const error_middleware_1 = require("../middleware/error.middleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AuthController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userRepository.getUserByEmail(email.toLowerCase());
                if (!user) {
                    throw new error_middleware_1.ResponseError(401, 'Email not found');
                }
                if (!(yield bcrypt_1.default.compare(password, user.password))) {
                    throw new error_middleware_1.ResponseError(401, 'Password is wrong');
                }
                const payload = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                };
                const secret = process.env.JWT_SECRET;
                const token = jsonwebtoken_1.default.sign(payload, secret, {
                    expiresIn: process.env.JWT_EXPIRES,
                });
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    httpOnly: true,
                };
                return res.json({
                    status: 'success',
                    token: token,
                    data: {
                        user: {
                            _id: user._id,
                            username: user.username,
                            fullname: user.fullname,
                            email: user.email,
                            bio: user.bio,
                            supporterCount: user.supporterCount,
                            supportingCount: user.supportingCount,
                            photo: user.photo,
                            categoryResolution: user.categoryResolution,
                            isPublic: user.isPublic,
                        },
                    },
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json({ status: 'success', message: 'Sucessfully logout.' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = AuthController;
