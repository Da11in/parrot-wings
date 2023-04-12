export type CreateTransactionDTO = {
  amount: number;
  recipientId: number;
};

export type TransactionDTO = {
  id: number;
  transactionDate: Date;
  amount: number;
  type: "incoming" | "outgoing";
  balanceAfterTransaction: number;
  recipientId: number | null;
  senderId: number | null;
};

export type Transaction = {
  id: number;
  user_id: number;
  transaction_date: Date;
  amount: number;
  incoming: number;
  balance_after_transaction: number;
  recipient_id: number | null;
  sender_id: number | null;
};

export type CreateTransactionParams = {
  senderId: number;
  amount: number;
  recipientId: number;
};

export type GetBalancesParams = Omit<CreateTransactionParams, "amount">;

export type GetBalancesReturnType = {
  senderBalance: number;
  recipientBalance: number;
};

export type BalancesQueryType = {
  id: number;
  balance: number;
};

export type InsertTransactionParams = {
  senderId: number;
  recipientId: number;
  amount: number;
  newSenderBalance: number;
  newRecipientBalance: number;
};
