import { Router } from "express";
import interfaces from "../../controller/admin/dashboard";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

router.post("/employee/create", verifyToken, interfaces.createEmplyee);

export default router;
