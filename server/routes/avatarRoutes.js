import { setAvatar}  from "../controllers/avatarsController.js";
import express from "express";
import router from "./userRoutes.js";

router.post("/setAvatar/:id", setAvatar);

export default router;