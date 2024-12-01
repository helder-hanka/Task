import { Request, Response, NextFunction } from "express";
import Employee from "../../models/employee";
import Task from "../../models/task";
import date from "../../utils/date";
import testMongoose from "../../utils/testMongoose";

type ITask = {
  startTime: Date;
  endTime: Date;
};

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
      if (!label?.trim()) {
        return res.status(400).json({ message: "Invalid or empty label" });
      }
      const start = date.parse(startTime);
      const end = date.parse(endTime);
      const current = date.parse(currentDate);

      if (!start || !end || !current) {
        return res
          .status(400)
          .json({ message: "Invalid or missing CurrentDate" });
      }
      if (!start || start < current) {
        return res
          .status(400)
          .json({ message: "StartTime must not be in the past" });
      }
      if (!end || end < start) {
        return res
          .status(400)
          .json({ message: "EndTime must not be before StartTime" });
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
        .populate("assignedToEmployeeId", "name");

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

  assignTask: async (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<any> => {
    const { taskId, employeeId, currentDate } = req.body;
    const newCurrentDate = date.parse(currentDate);

    try {
      if (!taskId || (taskId && !testMongoose.objIdIsV(taskId))) {
        return res.status(400).json({ message: "Thask not found !" });
      }

      const task = await Task.findById(taskId);
      if (!task) return res.status(400).json({ message: "Task not found" });
      if (task?.assignedToEmployeeId)
        return res
          .status(400)
          .json({ message: "Task already assigned to someone!" });

      if (!employeeId || (employeeId && !testMongoose.objIdIsV(employeeId))) {
        return res.status(400).json({ message: "Invalid EmployeeId !" });
      }
      const employee = await Employee.findById(employeeId);
      if (!employee)
        return res.status(400).json({ message: "Employee not found" });

      if (!newCurrentDate) {
        return res
          .status(400)
          .json({ message: "Invalid or missing CurrentDate" });
      }

      const ongoingTask = await Task.findOne({
        assignedToEmployeeId: employeeId,
        endTime: { $exists: true },
      });

      if (ongoingTask) {
        return res
          .status(400)
          .json({ message: "Emplyee already has an ongoing task" });
      }

      const startofDay = new Date(newCurrentDate);
      startofDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(newCurrentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const tasksForDay = await Task.find({
        assignedToEmployeeId: employeeId,
        startTime: startofDay,
        endTime: endOfDay,
      });

      const totalHours = tasksForDay.reduce((total, t: ITask) => {
        const duration =
          (t.endTime.getTime() - t.startTime.getTime()) / (1000 * 60 * 60);
        return total + duration;
      }, 0);

      const taskDuration =
        (task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60);

      if (totalHours + taskDuration > 8) {
        return res
          .status(400)
          .json({ message: "Employee cannot 8 hours of work per day." });
      }

      task.assignedToEmployeeId = employeeId;
      await task.save();

      res.status(201).json({ message: "Task assigned successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
      console.log(error);
    }
  },
};

export default interfaces;
