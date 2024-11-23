import { Router } from "express";
import interfaces from "../../controller/admin/dashboard";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.post("/employee/create", verifyToken, interfaces.createEmployee);
router.post("/tasks", verifyToken, interfaces.CreateTask);
router.get("/tasks", verifyToken, interfaces.getTasks);

export default router;
