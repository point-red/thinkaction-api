import { DocInterface } from "../entities/docInterface";

export class Pagination {
  static paginate(query: DocInterface) {
    query.limit = query.limit || 10;
    query.page = query.page || 1;
    return query;
  }
}