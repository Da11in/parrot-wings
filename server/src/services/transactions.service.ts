import { ApiError } from "../helpers/ApiError";
import db from "../services/db.service";
import type {
  GetBalancesParams,
  GetBalancesReturnType,
  BalancesQueryType,
  InsertTransactionParams,
  CreateTransactionParams,
  Transaction,
} from "../types/transactions.types";

const getBalancesForTransaction = async (
  params: GetBalancesParams
): Promise<GetBalancesReturnType> =>
  new Promise((resolve, reject) => {
    const { senderId, recipientId } = params;

    const query = `SELECT id, balance FROM users WHERE id IN (${senderId}, ${recipientId})`;

    db.query(query, (err, res) => {
      if (err) {
        reject(err.message);
      }

      const senderBalance = res.find((row: BalancesQueryType) => row.id === senderId)?.balance;

      const recipientBalance = res.find(
        (row: BalancesQueryType) => row.id === recipientId
      )?.balance;

      if (senderBalance === undefined) {
        reject(new ApiError("Internal API error", 500));
      }
      if (recipientBalance === undefined) {
        reject(new ApiError("The user you are trying to transfer to was not found", 404));
      }

      resolve({ senderBalance, recipientBalance });
    });
  });

const makeTransaction = async (params: InsertTransactionParams) =>
  new Promise((resolve, reject) => {
    const { senderId, recipientId, amount, newSenderBalance, newRecipientBalance } = params;
    const query = `
  INSERT INTO transactions
  (user_id, amount, incoming, balance_after_transaction, recipient_id, sender_id)
  VALUES
  (${senderId}, ${amount}, 0, ${newSenderBalance}, ${recipientId}, NULL),
  (${recipientId}, ${amount}, 1, ${newRecipientBalance}, NULL, ${senderId});
  `;

    db.query(query, (err, res) => (err ? reject(err.message) : resolve(res)));
  });

const updateUserBalance = async (id: number, balance: number) =>
  new Promise((resolve, reject) => {
    const query = `
  UPDATE users
  SET balance = ${balance}
  WHERE id = ${id};`;

    db.query(query, (err, res) => (err ? reject(err.message) : resolve(res)));
  });

export const getAllTransactionsByUserId = async (id: number): Promise<Transaction[]> =>
  new Promise((resolve, reject) => {
    const query = `SELECT * FROM transactions WHERE user_id=${id} ORDER BY transaction_date DESC;`;
    db.query(query, (err, res) => (err ? reject(err.message) : resolve(res)));
  });

export const createTransaction = async (params: CreateTransactionParams) => {
  const { senderId, recipientId, amount } = params;

  const { senderBalance, recipientBalance } = await getBalancesForTransaction({
    senderId,
    recipientId,
  });

  if (amount > senderBalance) {
    throw new ApiError("Insufficient funds to complete the transfer", 400);
  }

  if (senderId === recipientId) {
    throw new ApiError("You cannot transfer funds to yourself", 400);
  }

  const newSenderBalance = senderBalance - amount;
  const newRecipientBalance = recipientBalance + amount;

  await makeTransaction({
    senderId,
    recipientId,
    amount,
    newSenderBalance,
    newRecipientBalance,
  });

  await updateUserBalance(senderId, newSenderBalance);
  await updateUserBalance(recipientId, newRecipientBalance);
};
