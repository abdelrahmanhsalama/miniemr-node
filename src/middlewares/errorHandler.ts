import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { appendFile } from "fs";

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("ERROR!\n", err);

  const message = err.message || "Internal server error";
  const statusCode = err.statusCode || 500;

  const log = `[${new Date().toISOString()}]
   ${req.method} ${req.originalUrl}
   ${err.statusCode}
   ${err.stack || err.message}
   
   `;

  appendFile("errors.log", log, (error) => {
    if (error) {
      console.error("Failed writing log:", error);
    }
  });

  res.status(statusCode).json({ success: false, message });
}
