import type { GetBalancesParams, InsertTransactionParams } from "../types/transactions.types";

export const balancesQuery = (params: GetBalancesParams) => {
  const { senderId, recipientId } = params;
  return `SELECT id, balance FROM users WHERE id IN (${senderId}, ${recipientId})`;
};

export const getAllTransactionsByUserIdQuery = (id: number) =>
  `SELECT * FROM transactions WHERE user_id=${id} ORDER BY transaction_date DESC;`;

export const insertIntoTransactionsQuery = (params: InsertTransactionParams) => {
  const { senderId, amount, newSenderBalance, recipientId, newRecipientBalance } = params;

  return `INSERT INTO transactions
  (user_id, amount, incoming, balance_after_transaction, recipient_id, sender_id)
  VALUES
  (${senderId}, ${amount}, 0, ${newSenderBalance}, ${recipientId}, NULL),
  (${recipientId}, ${amount}, 1, ${newRecipientBalance}, NULL, ${senderId});`;
};
