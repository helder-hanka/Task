import { Request, Response, NextFunction } from "express";
import Employee from "../../models/employee";
import Task from "../../models/task";
import date from "../../utils/date";

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

  CreateTask: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const adminId = req.userId;
    const { label, startTime, endTime } = req.body;

    try {
      if (!label.trim()) {
        return res.status(400).json({ message: "Invalid or empty label" });
      }
      const start = date.parse(startTime);
      const end = date.parse(endTime);
      const dateNow = new Date();

      if (!start || start < dateNow) {
        return res
          .status(400)
          .json({ message: "Invalid or missing startTime" });
      }
      if (!end || end < dateNow) {
        return res.status(400).json({ message: "Invalid or missing endTime" });
      }

      if (start >= end) {
        return res
          .status(400)
          .json({ message: "StartTime must be earlier than endTime" });
      }

      const newTask = new Task({ ...req.body, AdminId: adminId });
      await newTask.save();
      res
        .status(201)
        .json({ message: "Task created seccessfully", task: newTask });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default interfaces;
