"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
const error_middleware_1 = require("../middleware/error.middleware");
class PostEntity {
    constructor(post) {
        this.post = {
            _id: post._id,
            userId: post.userId,
            categoryResolutionId: post.categoryResolutionId,
            type: post.type,
            caption: post.caption,
            photo: post.photo,
            like: post.like,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            dueDate: post.dueDate,
            updatedDate: post.updatedDate,
            shareWith: post.shareWith,
            weeklyGoalId: post.weeklyGoalId,
            isComplete: post.isComplete,
            isUpdating: post.isUpdating || false,
            createdDate: post.createdDate,
        };
    }
    CheckData() {
        const errors = {};
        if (!this.post.type) {
            errors.type = 'Post type is required.';
        }
        else if (!['resolutions', 'weeklyGoals', 'completeGoals'].includes(this.post.type)) {
            errors.type = 'Post type must be either "resolutions", "weeklyGoals" or "completeGoals".';
        }
        if (this.post.type === 'resolutions' && !this.post.categoryResolutionId) {
            errors.categoryResolutionId = 'Category resolution id is required for resolutions.';
        }
        if (!this.post.caption) {
            errors.caption = 'Caption is required.';
        }
        if (!this.post.photo || this.post.photo.length === 0) {
            errors.photo = 'At least one photo is required.';
        }
        if (this.post.like && !Array.isArray(this.post.like)) {
            errors.like = 'Likes must be an array.';
        }
        if (this.post.commentCount && typeof this.post.commentCount !== 'number') {
            errors.commentCount = 'Comment count must be a number.';
        }
        if (this.post.likeCount && typeof this.post.likeCount !== 'number') {
            errors.likeCount = 'Like count must be a number.';
        }
        if (this.post.dueDate && !(this.post.dueDate instanceof Date)) {
            errors.dueDate = 'Due date must be a Date object.';
        }
        if (this.post.updatedDate && !(this.post.updatedDate instanceof Date)) {
            errors.updatedDate = 'Updated date must be a Date object.';
        }
        if (this.post.shareWith === undefined) {
            errors.shareWith = 'Share with is required.';
        }
        else if (!['everyone', 'supporter', 'private'].includes(this.post.shareWith)) {
            errors.shareWith = 'Share with must be either "everyone", "supporter", or "private".';
        }
        if (this.post.isComplete && typeof this.post.isComplete !== 'boolean') {
            errors.isComplete = 'isComplete must be a boolean value.';
        }
        if (this.post.isUpdating && typeof this.post.isUpdating !== 'boolean') {
            errors.isUpdating = 'isUpdating must be a boolean value.';
        }
        if (Object.keys(errors).length > 0) {
            throw new error_middleware_1.ResponseError2(400, JSON.stringify(errors));
        }
        return {
            _id: this.post._id,
            userId: this.post.userId,
            categoryResolutionId: this.post.categoryResolutionId,
            type: this.post.type,
            caption: this.post.caption,
            photo: this.post.photo,
            like: this.post.like,
            likeCount: this.post.likeCount,
            commentCount: this.post.commentCount,
            dueDate: this.post.dueDate,
            updatedDate: this.post.updatedDate,
            shareWith: this.post.shareWith,
            weeklyGoalId: this.post.weeklyGoalId,
            isComplete: this.post.isComplete,
            isUpdating: this.post.isUpdating,
            createdDate: this.post.createdDate,
        };
    }
}
exports.PostEntity = PostEntity;
