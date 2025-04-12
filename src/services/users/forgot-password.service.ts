import { ResponseError } from "../../middleware/error.middleware";
import { UserRepository } from "../../repositories/user.repository";
import { EmailService } from "../email.service";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class ForgotPasswordService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async initiateReset(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email.toLowerCase());
    if (!user) {
      throw new ResponseError(404, "Email not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiry to 10 minutes
    const resetTokenExpires = Date.now() + 10 * 60 * 1000;

    // Save hashed token to user
    await this.userRepository.updateUser(user._id.toString(), {
      passwordResetToken: hashedToken,
      passwordResetExpires: resetTokenExpires,
    });

    // Send reset email
    try {
      await EmailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      // If email fails, remove the reset token from user
      await this.userRepository.updateUser(user._id.toString(), {
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      });
      console.log(error);

      throw new ResponseError(500, "Error sending password reset email");
    }
  }

  public async verifyResetToken(token: string) {
    if (!token) {
      throw new ResponseError(400, "Reset token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await this.userRepository.getUserByResetToken(hashedToken);

    if (!user) {
      throw new ResponseError(400, "Invalid or expired reset token");
    }

    if (user.passwordResetExpires < Date.now()) {
      throw new ResponseError(400, "Reset token has expired");
    }

    return user;
  }

  public async resetPassword(token: string, newPassword: string) {
    const user = await this.verifyResetToken(token);

    // Update password and remove reset token
    await this.userRepository.updateUser(user._id.toString(), {
      password: newPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    // Generate new JWT token
    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const secret = process.env.JWT_SECRET!;
    const jwtToken = jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    return {
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        bio: user.bio,
        supporterCount: user.supporterCount,
        supportingCount: user.supportingCount,
        photo: user.photo,
        categoryResolution: user.categoryResolution,
        isPublic: user.isPublic,
      },
      token: jwtToken,
    };
  }
}
