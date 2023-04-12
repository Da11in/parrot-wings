import express from "express";
import { login, logout, refreshToken, signup } from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

export default router;
