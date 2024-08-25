"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    static paginate(query) {
        query.limit = query.limit || 10;
        query.page = query.page || 1;
        return query;
    }
}
exports.Pagination = Pagination;
