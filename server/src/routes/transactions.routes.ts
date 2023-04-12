import express from "express";
import * as TransactionsController from "../controllers/transactions.controller";

const router = express.Router();

router.get("/", TransactionsController.getAllTransactions);

router.post("/", TransactionsController.createTransaction);

export default router;
