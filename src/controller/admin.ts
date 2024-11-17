import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin";
import bcript from "bcrypt";

const admin = {
  signup: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(422).json({ message: "Email or password is empty!" });

    try {
      const existingAdmin = await Admin.findOne({ email: email });

      if (existingAdmin) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const passwordHash = await bcript.hash(password, 10);

      const admin = new Admin({ ...req.body, password: passwordHash });

      await admin.save();
      res.status(201).json({ message: "Admin Created" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default admin;
