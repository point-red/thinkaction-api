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
exports.PostRepository = void 0;
const database_1 = __importDefault(require("../database/database"));
const mongodb_1 = require("mongodb");
class PostRepository extends database_1.default {
    constructor() {
        super('posts');
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.insertOne(data);
        });
    }
    readOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: data });
        });
    }
    update2(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $push: { like: new mongodb_1.ObjectId(authUserId) }, $inc: { likeCount: 1 } });
        });
    }
    update3(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $pull: { like: new mongodb_1.ObjectId(authUserId) }, $inc: { likeCount: -1 } });
        });
    }
    aggregate(pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.aggregate(pipeline).toArray();
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    deleteMany() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.deleteMany({});
        });
    }
}
exports.PostRepository = PostRepository;
