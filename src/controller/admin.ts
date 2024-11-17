import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin";
import bcript from "bcrypt";

export const admin = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    const existingAdmin = await Admin.findOne({ email: req.body.email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = bcript.hash(req.body.password, 10);

    const admin = new Admin({ ...req.body, password: passwordHash });

    await admin.save();
  },
};
