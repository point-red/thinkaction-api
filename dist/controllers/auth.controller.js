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
const google_auth_library_1 = require("google-auth-library");
const oauth_1 = require("../config/oauth");
const url_1 = require("../utils/url");
const cloud_storage_1 = require("../utils/cloud-storage");
dotenv_1.default.config();
class AuthController {
    constructor(createUserService, userRepository) {
        this.createUserService = createUserService;
        this.userRepository = userRepository;
    }
    // public async googleGetAuthUrl(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const googleAuth = new GoogleAuth();
    //     const callbackUrl = req.query.callback as string;
    //     const url = googleAuth.getUrl(['profile', 'email'], callbackUrl);
    //     return res.status(200).json(url);
    //   } catch (error) {
    //     next(error);
    //   }
    // }
    // public async googleDriveGetAuthUrl(req: Request, res: Response, next: NextFunction) {
    //   throw new Error("Method not implemented.");
    // }
    googleOauthCallback(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const client = new google_auth_library_1.OAuth2Client(oauth_1.googleAuthConfig.clientId, oauth_1.googleAuthConfig.clientSecret, oauth_1.googleAuthConfig.redirectUri);
            if (req.body.code) {
                try {
                    req.body.credential = (_b = (_a = (yield client.getToken(req.body.code))) === null || _a === void 0 ? void 0 : _a.tokens) === null || _b === void 0 ? void 0 : _b.id_token;
                }
                catch (e) {
                    console.log(req.body);
                    return res.status(403).json({ message: "Login Failed" });
                }
            }
            const credentials = req.body.credential;
            const ticket = yield client.verifyIdToken({
                idToken: credentials,
            });
            const payload = ticket.getPayload();
            if (!(payload === null || payload === void 0 ? void 0 : payload.email))
                return res.status(403).json({ message: 'Forbidden' });
            let user = yield this.userRepository.getUserByEmail(payload.email);
            if (!(user === null || user === void 0 ? void 0 : user.email)) {
                let image = payload.picture;
                if (image !== undefined) {
                    try {
                        const response = yield (0, url_1.getResponse)(image);
                        image = yield cloud_storage_1.CloudStorage.send(response);
                        // await downloadImage(image, path.join(__dirname, '../images/' + filename))
                        // image = `images/${filename}`;
                    }
                    catch (e) {
                        image = null;
                    }
                }
                user = yield this.createUserService.handle({
                    username: payload.email,
                    email: payload.email,
                    fullname: payload.name,
                    photo: image,
                    password: Math.random().toFixed(32).substring(2)
                });
            }
            const newPayload = {
                _id: user._id,
                username: user.username,
                email: user.email,
            };
            const secret = process.env.JWT_SECRET;
            const token = jsonwebtoken_1.default.sign(newPayload, secret, {
                expiresIn: process.env.JWT_EXPIRES,
            });
            const cookieOptions = {
                expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            return res.cookie('jwt-token', token, cookieOptions).status(200).json({
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
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new error_middleware_1.ResponseError(401, 'Email not found');
                }
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
                return res.cookie('jwt-token', token, cookieOptions).status(200).json({
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
                return res.clearCookie('jwt-token').status(200).json({ status: 'success', message: 'Successfully logged out.' });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = AuthController;
