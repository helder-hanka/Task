import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin";
import bcript from "bcrypt";
import jwt from "jsonwebtoken";

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

  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "Email or password is empty!" });
    }

    try {
      const admin = await Admin.findOne({ email: email });

      if (!admin) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcript.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const SECRET_KEY = process.env.SECRET_KEY;

      if (!SECRET_KEY) {
        return res.status(401).json({ message: "Secret key is not defined" });
      }

      const token = jwt.sign(
        { email: admin.email, adminId: admin._id },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      return res
        .status(200)
        .json({ message: "Login successful", token, adminId: admin._id });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};

export default admin;
