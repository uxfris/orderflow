import { Router } from "express";
import * as controller from "../controller/auth.controller.js";

const router = Router();

router.post("/signin", controller.signin);
router.post("/signup", controller.signup);
router.get("/refresh-token", controller.refreshToken);

export default router;
