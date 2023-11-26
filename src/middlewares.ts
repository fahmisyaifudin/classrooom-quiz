import { NextFunction, Request, Response } from "express";

import ErrorResponse from "./schema/error";
import { getAuth } from "firebase-admin/auth";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return next(res.status(401));
    }
    const idToken = bearerToken?.split("Bearer ")[1] as string;
    const decodedToken = await getAuth().verifyIdToken(idToken);
    //req.user.id = decodedToken.uid;
    return next();
  } catch (error) {
    console.log(error);
    return next(res.status(401));
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}
