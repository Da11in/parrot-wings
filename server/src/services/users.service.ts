import { SignupRequest } from "../types/auth.types";
import type { User } from "../types/users.types";
import db from "./db.service";

const INITIAL_BALANCE = 500;

export const getUserById = async (id: number) =>
  new Promise((resolve, reject) => {
    db.query(`SELECT * from users WHERE id=${id}`, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res[0]);
    });
  });

export const getUserByEmail = (email: string): Promise<User> =>
  new Promise((resolve, reject) => {
    const query = `
  SELECT * FROM users WHERE email = '${email}'
  `;

    db.query(query, (err, res) => (err ? reject(err) : resolve(res[0])));
  });

export const createUser = async (data: SignupRequest) =>
  new Promise((resolve, reject) => {
    const { email, password, firstName, lastName } = data;
    const balance = INITIAL_BALANCE;

    const query = `
    INSERT INTO users (email, password, first_name, last_name, balance) 
    VALUES ('${email}', '${password}', '${firstName}', '${lastName}', ${balance});`;

    db.query(query, (err, res) => (err ? reject(err) : resolve(res.insertId)));
  });
