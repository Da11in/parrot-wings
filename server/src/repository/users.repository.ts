import QueryString from "qs";
import type { SignupRequest } from "../types/auth.types";

export const getAllQuery = (
  id: number,
  search: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
) => `
SELECT * FROM users 
WHERE 
(first_name LIKE '%${search || ""}%' OR last_name LIKE '%${search || ""}%')
AND
id <> ${id}
`;

export const getUserByIdQuery = (id: number) => `SELECT * from users WHERE id=${id}`;

export const getUserByEmailQuery = (email: string) => `
SELECT * FROM users WHERE email = '${email}'
`;

export const createUserQuery = (params: SignupRequest & { balance: number }) => {
  const { email, password, firstName, lastName, balance } = params;
  return `
  INSERT INTO users (email, password, first_name, last_name, balance) 
  VALUES ('${email}', '${password}', '${firstName}', '${lastName}', ${balance});`;
};

export const selectUserBalanceForUpdateQuery = (id: number) =>
  `SELECT balance FROM users WHERE id = ${id} FOR UPDATE;`;

export const updateUserBalanceQuery = (id: number, balance: number) =>
  `UPDATE users SET balance = ${balance} WHERE id = ${id};`;
