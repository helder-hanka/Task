import { Request, Response, NextFunction } from "express";
import Employee from "../../models/employee";
import Task from "../../models/task";
import date from "../../utils/date";
import testMongoose from "../../utils/testMongoose";

const interfaces = {
  createEmployee: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> => {
    const adminId = req.userId;
    const name = req.body.name?.trim().toLowerCase();

    if (!name) {
      return res.status(422).json({ message: "Name is Empty" });
    }
    try {
      if (!adminId || (adminId && !testMongoose.objIdIsV(adminId))) {
        return res.status(400).json({ message: "Invalid AdminId" });
      }
      const isExistName = await Employee.findOne({
        name: name,
      });
      if (isExistName?.name === name) {
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
    _next: NextFunction
  ): Promise<any> => {
    const adminId = req.userId;
    const { label, startTime, endTime, currentDate } = req.body;

    try {
      if (!label.trim()) {
        return res.status(400).json({ message: "Invalid or empty label" });
      }
      const start = date.parse(startTime);
      const end = date.parse(endTime);
      const newCurrentDate = date.parse(currentDate);

      if (!newCurrentDate) {
        return res
          .status(400)
          .json({ message: "Invalid or missing CurrentDate" });
      }
      if (!start || start < newCurrentDate) {
        return res
          .status(400)
          .json({ message: "Invalid or missing startTime" });
      }
      if (!end || end < newCurrentDate) {
        return res.status(400).json({ message: "Invalid or missing endTime" });
      }

      if (start > end) {
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

  getTasks: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> => {
    const sortBy = (req.query.sortBy as string) || "label";
    const sortOrder = (req.query.sortOrder as string) || "asc";

    const validSortKeys = ["label", "startTime", "endTime"];
    if (!validSortKeys.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort Key." });
    }

    const order = sortOrder === "asc" ? 1 : -1;

    try {
      const task = await Task.find()
        .sort({ [sortBy]: order })
        .populate("AdminId", "email")
        .populate("EmployeeId", "name");

      if (!task) {
        return res.status(400).json({ message: "Task not found" });
      }

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  deleteTask: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(400).json({ message: "Task not found" });
      await Task.findById(req.params.id);
      res.status(201).json({ message: "Task delete" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },
};

export default interfaces;
