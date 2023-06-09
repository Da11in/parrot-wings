import express from "express";
import * as AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/signup", AuthController.signup);

router.post("/logout", AuthController.logout);

router.post("/refresh-token", AuthController.refreshToken);

export default router;
