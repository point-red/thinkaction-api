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
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor(collection) {
        this.dbName = 'think_action';
        try {
            this.connect(collection);
        }
        catch (error) {
            console.error('Gagal terhubung ke MongoDB:', error);
            throw error;
        }
    }
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            let client = new mongodb_1.MongoClient(Database.uri);
            global.mongodbClient = client;
            client = yield client.connect();
            console.log("Connected to MongoDB.");
            return client;
        });
    }
    connect(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!global.mongodbClient) {
                yield Database.init();
            }
            this.client = global.mongodbClient;
            this.db = this.client.db(this.dbName);
            this.collection = this.db.collection(collection);
            const collections = yield this.db.listCollections({ name: collection }).toArray();
            if (collections.length === 0) {
                yield this.db.createCollection(collection);
                console.log(`Collection '${collection}' created.`);
            }
            this.collection = this.db.collection(collection);
        });
    }
    static disconnect(signal) {
        console.log(`Received ${signal}. Closing MongoDB connection...`);
        if (global.mongodbClient) {
            global.mongodbClient.close().then(() => {
                process.exit();
            });
        }
    }
}
Database.uri = process.env.DATABASE_URI || 'mongodb+srv://zildanmarginata:9i0GEZR8vImJTcuI@mymongodb.htazbwd.mongodb.net/mymongodb?retryWrites=true&w=majority';
exports.default = Database;
