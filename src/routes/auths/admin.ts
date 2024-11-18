import { Router } from "express";

import admin from "../../controller/auths/admin";

const router = Router();

router.post("/signup", admin.signup);
router.post("/login", admin.login);

export default router;
