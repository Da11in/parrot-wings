import { Transaction, TransactionDTO } from "../types/transactions.types";
import type { MeDTO, User, UserDTO } from "../types/users.types";

export const mapUsersToUserDTO = (users: User[]): UserDTO[] =>
  users.map((u) => ({ id: u.id, email: u.email, firstName: u.first_name, lastName: u.last_name }));

export const mapUserToMeDTO = (user: User): MeDTO => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  balance: user.balance,
});

export const mapTransactionsToTransactionDTO = (transactions: Transaction[]): TransactionDTO[] =>
  transactions.map((t) => ({
    id: t.id,
    transactionDate: t.transaction_date,
    amount: t.amount,
    type: t.incoming === 1 ? "incoming" : "outgoing",
    balanceAfterTransaction: t.balance_after_transaction,
    recipientId: t.recipient_id,
    senderId: t.sender_id,
  }));
