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
) => {
  const errMsg: string = "Not authentificated";
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: errMsg });
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      return res.status(401).json({ message: errMsg });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: errMsg });
    }

    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    return res.status(500).json({ error });
  }
};
