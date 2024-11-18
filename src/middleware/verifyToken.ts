import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errMsg: string = "Not authentificated";
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: errMsg });
      return;
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      res.status(401).json({ message: errMsg });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      res.status(401).json({ message: errMsg });
      return;
    }

    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};
