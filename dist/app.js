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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const routes_1 = require("./routes");
const database_1 = __importDefault(require("./database/database"));
const PORT = Number(process.env.PORT) || 5050;
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.init();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        credentials: true,
        origin: process.env.APP_URL
    }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, body_parser_1.json)());
    app.use((0, body_parser_1.urlencoded)({ extended: true }));
    app.use('/v1', routes_1.router);
    app.use(error_middleware_1.errorMiddleware);
    app.use('/', (req, res, next) => {
        res.json({});
    });
    app.listen(PORT, () => console.log(`running on port ${PORT}`));
    return app;
});
exports.default = {
    init
};
