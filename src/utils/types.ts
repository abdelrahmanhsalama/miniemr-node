import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadIdRole extends JwtPayload {
  userId: number;
  userRole: string;
}

export interface RequestIdRole extends Request {
  userId: number;
  userRole: string;
}
