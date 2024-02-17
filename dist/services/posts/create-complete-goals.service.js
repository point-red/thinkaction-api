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
const posts_entity_1 = require("../../entities/posts.entity");
const user_repository_1 = require("../../repositories/user.repository");
const mongodb_1 = require("mongodb");
const update_resolution_service_1 = __importDefault(require("./update-resolution.service"));
class CreateCompleteGoalsService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    handle(data, authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = new posts_entity_1.PostEntity({
                userId: new mongodb_1.ObjectId(authUserId),
                categoryResolutionId: new mongodb_1.ObjectId(data.categoryResolutionId),
                type: 'completeGoals',
                caption: data.caption,
                photo: data.photo,
                like: [],
                likeCount: 0,
                commentCount: 0,
                dueDate: new Date(data.dueDate),
                updatedDate: data.updatedDate,
                shareWith: data.shareWith,
                weeklyGoalId: new mongodb_1.ObjectId(data.weeklyGoalId),
                isComplete: data.isComplete,
                isUpdating: false,
                createdDate: new Date(),
            });
            let postData = postEntity.CheckData();
            let post = yield this.postRepository.create(postData);
            const dataPost = yield this.postRepository.readOne(post.insertedId.toString());
            const categoryResolution = yield this.postRepository.aggregate([
                {
                    $match: {
                        type: 'resolutions',
                    },
                },
                {
                    $match: {
                        categoryResolutionId: new mongodb_1.ObjectId(data.categoryResolutionId),
                    },
                },
            ]);
            let updateResolutionsService = new update_resolution_service_1.default(this.postRepository);
            const data2 = {
                isComplete: data.isComplete,
            };
            yield updateResolutionsService.handle(data2, authUserId, categoryResolution[0]._id);
            const userRepository = new user_repository_1.UserRepository();
            const userData = yield userRepository.readOne(authUserId);
            return {
                _id: dataPost._id,
                userId: dataPost.userId,
                categoryResolutionId: dataPost.categoryResolutionId,
                weeklyGoalId: dataPost.weeklyGoalId,
                type: dataPost.type,
                caption: dataPost.caption,
                photo: dataPost.photo,
                likeCount: dataPost.likeCount,
                commentCount: dataPost.commentCount,
                createdDate: dataPost.createdDate,
                updatedDate: dataPost.updatedDate,
                shareWith: dataPost.shareWith,
                isComplete: dataPost.isComplete,
                userInfo: {
                    _id: userData._id,
                    username: userData.username,
                    photo: userData.photo,
                    categoryResolution: userData.categoryResolution,
                },
            };
        });
    }
}
exports.default = CreateCompleteGoalsService;
