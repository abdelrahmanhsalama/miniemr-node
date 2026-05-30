import { NextFunction, Request, Response } from "express";
import { RequestIdRole } from "../utils/types.js";

import { AppError } from "../utils/AppError.js";

export function checkRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as RequestIdRole).userRole;

      if (!userRole) {
        throw new AppError("Unauthorized", 401);
      }

      if (!allowedRoles.includes(userRole)) {
        throw new AppError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
