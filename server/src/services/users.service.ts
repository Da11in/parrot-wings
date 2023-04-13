import QueryString from "qs";
import type { SignupRequest } from "../types/auth.types";
import type { User } from "../types/users.types";
import * as UsersRepository from "../repository/users.repository";
import db from "./db.service";
import { ApiError } from "../helpers/ApiError";

const INITIAL_BALANCE = 500;

export const getAll = async (
  id: number,
  search: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    const query = UsersRepository.getAllQuery(id, search);

    db.query(query, (err, res) => (err ? reject(new ApiError(err.message, 500)) : resolve(res)));
  });

export const getUserById = async (id: number): Promise<User> =>
  new Promise((resolve, reject) => {
    const query = UsersRepository.getUserByIdQuery(id);

    db.query(query, (err, res) => {
      if (err) {
        reject(new ApiError(err.message, 500));
      }
      resolve(res[0]);
    });
  });

export const getUserByEmail = (email: string): Promise<User> =>
  new Promise((resolve, reject) => {
    const query = UsersRepository.getUserByEmailQuery(email);

    db.query(query, (err, res) => (err ? reject(new ApiError(err.message, 500)) : resolve(res[0])));
  });

export const createUser = async (data: SignupRequest) =>
  new Promise((resolve, reject) => {
    const query = UsersRepository.createUserQuery({ ...data, balance: INITIAL_BALANCE });

    db.query(query, (err, res) =>
      err ? reject(new ApiError(err.message, 500)) : resolve(res.insertId)
    );
  });
