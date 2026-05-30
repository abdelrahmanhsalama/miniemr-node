import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";
import {
  checkRefreshTokenQuery,
  deleteRefreshTokenQuery,
  getUserByIdQuery,
  getUserByUsernameQuery,
  refreshRefreshTokenQuery,
  updatePasswordByUserQuery,
} from "../db/authQueries.js";
import { JwtPayloadIdRole, RequestIdRole } from "../utils/types.js";

export async function loginToAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsernameQuery(username.toLowerCase().trim());
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }
    if (!user.is_active) {
      throw new AppError("Account disabled", 403);
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError("Invalid credentials", 401);
    }

    const userId = user.id;
    const userRole = user.role;
    const accessToken = jwt.sign(
      { userId, userRole },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    await refreshRefreshTokenQuery(userId, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      data: { userRole, accessToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    const checkedToken = await checkRefreshTokenQuery(refreshToken);
    if (!checkedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    let decoded: JwtPayloadIdRole;
    try {
      const result = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET!,
      );

      if (typeof result === "string") {
        throw new AppError("Invalid token format", 401);
      }

      decoded = result as JwtPayloadIdRole;
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    if (decoded.userId !== checkedToken.user_id) {
      throw new AppError("Invalid token", 403);
    }

    const userId = decoded.userId;

    const user = await getUserByIdQuery(userId);
    if (!user || !user.is_active) {
      throw new AppError("Account disabled", 403);
    }

    const userRole = user.role;

    const accessToken = jwt.sign(
      { userId, userRole },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    const newRefreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      },
    );
    await refreshRefreshTokenQuery(userId, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      data: { userRole, accessToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function logoutFromAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    let decoded: JwtPayloadIdRole;
    try {
      const result = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET!,
      );

      if (typeof result === "string") {
        throw new AppError("Invalid token format", 401);
      }

      decoded = result as JwtPayloadIdRole;
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const userId = decoded.userId;

    await deleteRefreshTokenQuery(userId);

    res.clearCookie("refreshToken");

    return res.json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePasswordByUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as RequestIdRole).userId;
    const oldPassword = req.body.oldPassword?.trim();
    const newPassword = req.body.newPassword?.trim();

    const user = await getUserByIdQuery(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const passwordMatches = await bcrypt.compare(
      oldPassword,
      user.password_hash,
    );
    if (!passwordMatches) {
      throw new AppError("Wrong old password", 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await updatePasswordByUserQuery(userId, passwordHash);

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
