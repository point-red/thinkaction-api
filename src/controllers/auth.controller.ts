import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { ResponseError } from '../middleware/error.middleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { googleAuthConfig } from '../config/oauth';
import CreateUserService from '../services/users/create.service';
import { getResponse } from '../utils/url';
import { CloudStorage } from '../utils/cloud-storage';

dotenv.config();

export default class AuthController {

  private userRepository: UserRepository;
  private createUserService: CreateUserService;

  constructor(createUserService: CreateUserService, userRepository: UserRepository) {
    this.createUserService = createUserService;
    this.userRepository = userRepository;
  }

  // public async googleGetAuthUrl(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const googleAuth = new GoogleAuth();
  //     const callbackUrl = req.query.callback as string;
  //     const url = googleAuth.getUrl(['profile', 'email'], callbackUrl);

  //     return res.status(200).json(url);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // public async googleDriveGetAuthUrl(req: Request, res: Response, next: NextFunction) {
  //   throw new Error("Method not implemented.");
  // }
  public async googleOauthCallback(req: Request, res: Response, next: NextFunction) {
    const client = new OAuth2Client(googleAuthConfig.clientId, googleAuthConfig.clientSecret, googleAuthConfig.redirectUri);
    if (req.body.code) {
      try {
        req.body.credential = (await client.getToken(req.body.code))?.tokens?.id_token;
      } catch (e) {
        return res.status(403).json({ message: "Login Failed" });
      }
    }
    const credentials = req.body.credential;
    if (!credentials) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    const ticket = await client.verifyIdToken({
      idToken: credentials,
      audience: googleAuthConfig.clientId,
    })

    const payload = ticket.getPayload()
    if (!payload?.email)
      return res.status(403).json({ message: 'Forbidden' });

    let user = await this.userRepository.getUserByEmail(payload.email);

    if (!user?.email) {
      let image: any = payload.picture;
      if (image !== undefined) {
        try {
          const response = await getResponse(image);
          image = await CloudStorage.send(response);
        } catch (e) {
          image = null;
        }
      }

      let username = 'user_' + Math.random().toFixed(30).substring(3, 19);
      let i = 0;

      while (await this.userRepository.getUserByUsername(username)) {
        username = 'user_' + Math.random().toFixed(30).substring(3, 19);
        i++;
        if (i > 10) {
          throw new Error('Some error occurred while generating username');
        }
      }

      user = await this.createUserService.handle({
        username: username,
        email: payload.email,
        fullname: payload.name,
        bio: '',
        photo: image,
        password: '',
        usePassword: false,
      });
    }
    const newPayload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET!;

    const token = jwt.sign(newPayload, secret, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    const cookieOptions = {
      expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie('jwt-token', token, cookieOptions).status(200).json({
      status: 'success',
      token: token,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          bio: user.bio,
          needsPassword: !user.password?.length,
          supporterCount: user.supporterCount,
          supportingCount: user.supportingCount,
          photo: user.photo,
          categoryResolution: user.categoryResolution,
          isPublic: user.isPublic,
        },
      },
    });
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ResponseError(401, 'Email not found');
      }

      const user = await this.userRepository.getUserByEmail(email.toLowerCase());

      if (!user) {
        throw new ResponseError(401, 'Email not found');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new ResponseError(401, 'Password is wrong');
      }

      const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };

      const secret = process.env.JWT_SECRET!;

      const token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES,
      });

      const cookieOptions = {
        expiresIn: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie('jwt-token', token, cookieOptions).status(200).json({
        status: 'success',
        token: token,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            needsPassword: !user.password?.length,
            email: user.email,
            bio: user.bio,
            supporterCount: user.supporterCount,
            supportingCount: user.supportingCount,
            photo: user.photo,
            categoryResolution: user.categoryResolution,
            isPublic: user.isPublic,
          },
        },
      });
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      return res.clearCookie('jwt-token').status(200).json({ status: 'success', message: 'Successfully logged out.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
