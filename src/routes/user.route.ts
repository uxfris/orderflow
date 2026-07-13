import { Router } from "express";
import * as controller from "../controller/user.controller.js";

const router = Router();

router.get("/", controller.getUsers);
router.get("/:id", controller.getUser);
// router.post("/", controller.createUser);
router.patch("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

export default router;
