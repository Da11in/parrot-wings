import express from "express";
import * as UsersController from "../controllers/users.controller";

const router = express.Router();

router.get("/", (req, res) => {
  UsersController.getAllUsers(req, res);
});

router.get("/me", (req, res) => {
  UsersController.getUser(req, res);
});

export default router;
