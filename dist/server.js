"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database/database"));
process.on('SIGINT', () => database_1.default.disconnect('SIGINT'));
process.on('SIGTERM', () => database_1.default.disconnect('SIGTERM'));
module.exports = () => {
    app_1.default.init();
};
