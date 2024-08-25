"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.googleAuthConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
};
