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
import * as TransactionsRepository from "../repository/transactions.repository";
import * as UsersRepository from "../repository/users.repository";

const getBalancesForTransaction = async (
  params: GetBalancesParams
): Promise<GetBalancesReturnType> =>
  new Promise((resolve, reject) => {
    const { senderId, recipientId } = params;

    const query = TransactionsRepository.balancesQuery(params);

    db.query(query, (err, res) => {
      if (err) {
        reject(new ApiError(err.message, 500));
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
    const { senderId, recipientId, newSenderBalance, newRecipientBalance, amount } = params;

    db.beginTransaction((err) => {
      if (err) reject(new ApiError(err.message, 500));

      db.query(UsersRepository.selectUserBalanceForUpdateQuery(senderId), (err) => {
        if (err) {
          return db.rollback((err) => {
            reject(new ApiError(err.message, 500));
          });
        }

        db.query(UsersRepository.selectUserBalanceForUpdateQuery(recipientId), (err) => {
          if (err) {
            return db.rollback((err) => {
              reject(new ApiError(err.message, 500));
            });
          }

          db.query(UsersRepository.updateUserBalanceQuery(senderId, newSenderBalance), (err) => {
            if (err) {
              return db.rollback((err) => {
                reject(new ApiError(err.message, 500));
              });
            }

            db.query(
              UsersRepository.updateUserBalanceQuery(recipientId, newRecipientBalance),
              (err) => {
                if (err) {
                  return db.rollback((err) => {
                    reject(new ApiError(err.message, 500));
                  });
                }

                db.query(TransactionsRepository.insertIntoTransactionsQuery(params), (err) => {
                  if (err) {
                    return db.rollback((err) => {
                      reject(new ApiError(err.message, 500));
                    });
                  }

                  db.commit((err) => {
                    if (err) {
                      return db.rollback((err) => {
                        reject(new ApiError(err.message, 500));
                      });
                    }
                  });

                  resolve(true);
                });
              }
            );
          });
        });
      });
    });
  });

export const getAllTransactionsByUserId = async (id: number): Promise<Transaction[]> =>
  new Promise((resolve, reject) => {
    const query = TransactionsRepository.getAllTransactionsByUserIdQuery(id);
    db.query(query, (err, res) => (err ? reject(new ApiError(err.message, 500)) : resolve(res)));
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

  const newSenderBalance = senderBalance - amount;
  const newRecipientBalance = recipientBalance + amount;

  await makeTransaction({
    senderId,
    recipientId,
    amount,
    newSenderBalance,
    newRecipientBalance,
  });
};
