import { Router } from "express";
import employee from "../../controller/admin/dashboard";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.post("/employee/create", verifyToken, employee.create);

export default router;
