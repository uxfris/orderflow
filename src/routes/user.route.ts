import { Router } from "express";
import * as controller from "../controller/user.controller.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", auth, controller.getUsers);
router.get("/:id", auth, controller.getUser);
// router.post("/", controller.createUser);
router.patch("/:id", auth, controller.updateUser);
router.delete("/:id", auth, controller.deleteUser);

export default router;
