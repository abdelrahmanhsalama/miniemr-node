import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import {
  createUserQuery,
  getUsersQuery,
  reverseActivationQuery,
  updatePasswordByAdminQuery,
  updateUserQuery,
} from "../db/adminQueries.js";
import { getUserByIdQuery } from "../db/authQueries.js";
import { AppError } from "../utils/AppError.js";
import { RequestIdRole } from "../utils/types.js";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await getUsersQuery();

    return res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, username, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    await createUserQuery(
      name.trim(),
      username.trim().toLowerCase(),
      passwordHash,
      role,
    );

    return res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.code == 23505) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: userId } = req.params;
    const { name, username, role } = req.body;

    const targetUser = await getUserByIdQuery(Number(userId));

    if (targetUser.username == "admin") {
      throw new AppError("Can't modify admin account", 403);
    }

    await updateUserQuery(name.trim(), username.trim(), role, Number(userId));

    return res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.code == 23505) {
      return res.status(400).json({
        success: false,
        message: "Username already in database",
      });
    }
    next(error);
  }
}

export async function updatePasswordByAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: userId } = req.params;
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    await updatePasswordByAdminQuery(passwordHash, Number(userId));

    return res.json({
      success: true,
    });
  } catch (error: any) {
    if (error.code == 23505) {
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });
    }
    next(error);
  }
}

export async function reverseActivation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: userId } = req.params;

    const targetUser = await getUserByIdQuery(Number(userId));

    if (targetUser.username == "admin") {
      throw new AppError("Can't deactivate admin account", 403);
    }

    if ((req as RequestIdRole).userId === targetUser.id) {
      throw new AppError("You can't deactivate your own account", 403);
    }

    await reverseActivationQuery(Number(userId));

    return res.json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
}
