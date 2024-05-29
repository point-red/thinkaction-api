import { NextFunction, Request, Response } from 'express';
import { ResponseError } from './error.middleware';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface UserData {
  _id: string;
  username: string;
  email: string;
  photo: string;
  role: string;
}

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const validationReq = req;
  const { authorization } = validationReq.headers;

  if (!authorization && !req.cookies['jwt-token']) {
    throw new ResponseError(401, 'Please loggin to get access');
  }

  const token = authorization?.split(' ')[1] || req.cookies['jwt-token'];
  const secret = process.env.JWT_SECRET!;

  try {
    const jwtDecode = jwt.verify(token, secret);

    if (typeof jwtDecode !== 'string') {
      validationReq.userData = jwtDecode as UserData;
    }
  } catch (error) {
    throw new ResponseError(401, 'Unauthorized');
  }

  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const validationReq = req;
  if (validationReq.userData.role !== 'admin') {
    throw new ResponseError(403, "You don't have permission");
  }

  next();
};
