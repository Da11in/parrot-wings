import express from "express";
import { createTransaction, getAllTransactions } from "../controllers/transactions.controller";

const router = express.Router();

router.get("/", (req, res) => {
  getAllTransactions(req, res);
});

router.post("/", (req, res) => {
  createTransaction(req, res);
});

export default router;
