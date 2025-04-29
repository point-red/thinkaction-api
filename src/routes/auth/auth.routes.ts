import { Router } from "express";
import AuthController from "../../controllers/auth.controller";
import { UserRepository } from "../../repositories/user.repository";
import CreateUserService from "../../services/users/create.service";

const router = Router();
const userRepository = new UserRepository();
const createUserService = new CreateUserService(userRepository);
const authController = new AuthController(createUserService, userRepository);

router.post("/oauth-callback", (req, res, next) =>
  authController.googleOauthCallback(req, res, next)
);
router.post("/forgot-password", (req, res, next) =>
  authController.forgotPassword(req, res, next)
);
router.get("/reset-password/:token", (req, res, next) =>
  authController.verifyResetToken(req, res, next)
);
router.post("/reset-password/:token", (req, res, next) =>
  authController.resetPassword(req, res, next)
);

export default router;
