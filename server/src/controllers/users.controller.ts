import { Request, Response } from "express";
import * as UsersService from "../services/users.service";

export const getAllUsers = (req: Request, res: Response) => {};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UsersService.getUserById(1);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send((err as { message: string }).message);
  }
};
