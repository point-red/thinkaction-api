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
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../database/database"));
const mongodb_1 = require("mongodb");
class UserRepository extends database_1.default {
    constructor() {
        super('users');
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.insertOne(data);
        });
    }
    aggregate(pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.aggregate(pipeline).toArray();
        });
    }
    readOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    }
    findOne1(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({
                _id: new mongodb_1.ObjectId(id),
                $and: [
                    {
                        supporter: { $ne: new mongodb_1.ObjectId(authUserId) },
                    },
                    {
                        request: { $ne: new mongodb_1.ObjectId(authUserId) },
                    },
                ],
            });
        });
    }
    findOne2(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) }, { projection: { supporterCount: 1, isPublic: 1 } });
        });
    }
    findOne3(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({
                _id: new mongodb_1.ObjectId(id),
                supporter: new mongodb_1.ObjectId(authUserId),
            });
        });
    }
    findOne4(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({ _id: new mongodb_1.ObjectId(id) }, { projection: { supportingCount: 1, isPublic: 1 } });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.findOne({ email: email });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: data,
            });
        });
    }
    updateOne(id, authUserId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $addToSet: { supporter: new mongodb_1.ObjectId(authUserId), notification: notificationId },
                $inc: { supporterCount: 1, notificationCount: 1 },
            });
        });
    }
    updateOne2(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(authUserId) }, {
                $addToSet: { supporting: new mongodb_1.ObjectId(id) },
                $inc: { supportingCount: 1 },
            });
        });
    }
    updateOne3(id, authUserId, notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $addToSet: { request: new mongodb_1.ObjectId(authUserId), notification: notificationId },
                $inc: { requestCount: 1, notificationCount: 1 },
            });
        });
    }
    updateOne4(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $pull: { supporter: new mongodb_1.ObjectId(authUserId) },
                $inc: { supporterCount: -1 },
            });
        });
    }
    updateOne5(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(authUserId) }, {
                $pull: { supporting: new mongodb_1.ObjectId(id) },
                $inc: { supportingCount: -1 },
            });
        });
    }
    updateOne6(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $addToSet: { supporter: new mongodb_1.ObjectId(authUserId) },
                $pull: { request: new mongodb_1.ObjectId(authUserId) },
                $inc: { supporterCount: 1, requestCount: -1 },
            });
        });
    }
    updateOne7(id, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $pull: { request: new mongodb_1.ObjectId(authUserId) },
                $inc: { requestCount: -1 },
            });
        });
    }
    updateOne8(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(authUserId) }, { $addToSet: { historyAccount: data[0] } });
        });
    }
    updateOne9(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(authUserId) }, { $set: { historyAccount: [] } });
        });
    }
    updateOne10(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ notification: new mongodb_1.ObjectId(id) }, { $pull: { notification: new mongodb_1.ObjectId(id) } });
        });
    }
    updateOne11(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $push: { categoryResolution: data } });
        });
    }
    updateOne12(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name !== null) {
                return yield this.collection.updateOne({
                    _id: new mongodb_1.ObjectId(id),
                    'categoryResolution._id': new mongodb_1.ObjectId(data._id),
                }, {
                    $set: {
                        'categoryResolution.$.name': data.name,
                        'categoryResolution.$.resolution': data.resolution,
                        'categoryResolution.$.isComplete': data.isComplete,
                        'categoryResolution.$.createdDate': data.createdDate,
                    },
                });
            }
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
exports.UserRepository = UserRepository;
