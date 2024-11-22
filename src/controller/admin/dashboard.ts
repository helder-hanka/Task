import { Request, Response, NextFunction } from "express";
import Employee from "../../models/employee";

const interfaces = {
  createEmplyee: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const adminId = req.userId;
    const name = req.body.name?.trim().toLowerCase();

    if (!name) {
      return res.status(422).json({ message: "Name is Empty" });
    }
    try {
      const isExistName = await Employee.findOne({
        name: name,
      });
      if (isExistName === name) {
        return res.status(400).json({ message: `${name} already exists` });
      }

      const newName = new Employee({
        name: name,
        AdminId: adminId,
      });

      await newName.save();
      res.status(201).json({ message: "Created employee" });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};

export default interfaces;
