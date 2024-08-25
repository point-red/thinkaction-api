import type { MongoClient } from "mongodb";

interface UserData {
  _id: string;
  username: string;
  email: string;
  photo: string;
  role: string;
}

declare global {
  var mongodbClient: MongoClient | undefined;
  declare namespace Express {
    export interface Request {
      userData: UserData
    }
  }
}