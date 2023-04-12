import express from "express";

import authRoutes from "./auth.routes";
import transactionsRoutes from "./transactions.routes";
import usersRoutes from "./users.routes";
import { protectedRoute } from "../middlewares";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", protectedRoute, usersRoutes);
router.use("/transactions", protectedRoute, transactionsRoutes);

export default router;
