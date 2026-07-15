import { Router } from "express";
import * as controller from "../controller/auth.controller.js";
import { loginLimiter } from "../middleware/limiter.js";

const router = Router();

router.post("/signin", loginLimiter, controller.signin);
router.post("/signup", controller.signup);
router.get("/refresh-token", controller.refreshToken);

export default router;
