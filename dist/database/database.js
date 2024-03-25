"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor(collection) {
        this.uri = process.env.DATABASE_URI || 'mongodb+srv://zildanmarginata:9i0GEZR8vImJTcuI@mymongodb.htazbwd.mongodb.net/mymongodb?retryWrites=true&w=majority';
        this.dbName = 'think_action';
        try {
            this.client = new mongodb_1.MongoClient(this.uri);
            this.client.connect();
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection(collection);
            console.log('Berhasil terhubung ke MongoDB');
        }
        catch (error) {
            console.error('Gagal terhubung ke MongoDB:', error);
            throw error;
        }
    }
}
exports.default = Database;
