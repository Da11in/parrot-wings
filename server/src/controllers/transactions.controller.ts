import { Request } from "express";
import { withErrorHandling } from "../helpers/withErrorHandling";
import { CreateTransactionDTO } from "../types/transactions.types";
import { getTokenFromRequest } from "../helpers/getTokenFromRequest";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import * as TransactionsValidations from "../validations/transactions.validations";
import * as TransactionsService from "../services/transactions.service";
import { ApiError } from "../helpers/ApiError";
import { mapTransactionsToTransactionDTO } from "../helpers/mappers";

export const getAllTransactions = withErrorHandling(async (req, res) => {
  const token = getTokenFromRequest(req);
  const id = getUserIdFromToken(token);

  const data = await TransactionsService.getAllTransactionsByUserId(id);

  res.status(200).send(mapTransactionsToTransactionDTO(data));
});

export const createTransaction = withErrorHandling(
  async (req: Request<{}, {}, CreateTransactionDTO>, res) => {
    const { error } = TransactionsValidations.createTransactionSchema.validate(req.body);

    if (error) {
      throw new ApiError(error.message, 400);
    }

    const { amount, recipientId } = req.body;

    const token = getTokenFromRequest(req);
    const id = getUserIdFromToken(token);

    await TransactionsService.createTransaction({
      senderId: id,
      amount,
      recipientId,
    });

    res.status(201).send({ message: "Success" });
  }
);
