import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({
      status: "error",
      message: "JWT token is missing",
    });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      response.status(500).json({
        status: "error",
        message: "Internal server error",
      });
      return;
    }

    const decodeToken = verify(token, jwtSecret);

    if (!decodeToken) {
      response.status(401).json({
        status: "error",
        message: "Invalid JWT token",
      });
    }

    return next();
  } catch (error) {
    response.status(401).json({
      status: "error",
      message: "Invalid JWT token",
    });
  }
}
