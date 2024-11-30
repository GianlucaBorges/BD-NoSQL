import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import "dotenv/config";

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void | Response {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      status: "error",
      message: "JWT token is missing",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return response.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }

    const decodeToken = verify(token, jwtSecret);

    if (!decodeToken) {
      return response.status(401).json({
        status: "error",
        message: "Invalid JWT token",
      });
    }

    return next();
  } catch (error) {
    return response.status(401).json({
      status: "error",
      message: "Invalid JWT token",
    });
  }
}
