"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appUrl = exports.apiUrl = exports.appName = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.appName = "pointhub-thinkaction";
exports.apiUrl = process.env.API_URL || "https://api-think-action.vercel.app/v1/notifications";
exports.appUrl = process.env.APP_URL || "https://think-action.vercel.app";
