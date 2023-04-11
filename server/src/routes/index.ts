import express from "express";

import authRoutes from "./auth.routes";
import transactionsRoutes from "./transactions.routes";
import usersRoutes from "./users.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/transactions", transactionsRoutes);

export default router;
