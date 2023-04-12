import express from "express";
import * as UsersController from "../controllers/users.controller";

const router = express.Router();

router.get("/", UsersController.getAllUsers);

router.get("/me", UsersController.getMe);

export default router;
