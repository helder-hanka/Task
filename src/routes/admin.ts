import { Router } from "express";

import admin from "../controller/admin";

const router = Router();

router.post("/signup", admin.signup);
router.post("/login", admin.login);

export default router;
