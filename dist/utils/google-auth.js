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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuth = void 0;
const googleapis_1 = require("googleapis");
const oauth_js_1 = require("../config/oauth.js");
class GoogleAuth {
    constructor() {
        this.oAuth2Client = new googleapis_1.google.auth.OAuth2(oauth_js_1.googleAuthConfig.clientId, oauth_js_1.googleAuthConfig.clientSecret, oauth_js_1.googleAuthConfig.redirectUri);
    }
    getOAuth2Client() {
        return this.oAuth2Client;
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.oAuth2Client.refreshAccessToken();
            console.log(tokens);
        });
    }
    getUrl(scopes, callbackUrl) {
        try {
            const result = this.oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: scopes,
                state: callbackUrl,
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    getToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.oAuth2Client.getToken(code);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOAuth2(tokens) {
        try {
            console.log("Token", tokens);
            this.oAuth2Client.setCredentials(tokens);
            console.log("AuthClient", this.oAuth2Client);
            // new google.auth.OAuth2({ version: "v2", auth: this.oAuth2Client });
            return googleapis_1.google.oauth2({ version: "v2", auth: this.oAuth2Client });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.GoogleAuth = GoogleAuth;
