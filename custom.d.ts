interface UserData {
  _id: string;
  username: string;
  email: string;
  photo: string;
  role: string;
}

declare namespace Express {
  export interface Request {
    userData: UserData
  }
}