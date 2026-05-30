import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { JwtPayloadIdRole, RequestIdRole } from "../utils/types.js";

import jwt from "jsonwebtoken";

export const addIdRole = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return new AppError("Unauthorized", 401);
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const result = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
    );

    if (typeof result === "string") {
      throw new AppError("Invalid token format", 401);
    }

    const decoded = result as JwtPayloadIdRole;

    (req as RequestIdRole).userId = decoded.userId;
    (req as RequestIdRole).userRole = decoded.userRole;

    next();
  } catch (error) {
    next(error);
  }
};
