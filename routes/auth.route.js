import express from "express";
import { login, signup } from "../controllers/auth.controller.js";
import verfiyToken from "../middlewares/verfiyToken.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login", verfiyToken, login);

export default router;
