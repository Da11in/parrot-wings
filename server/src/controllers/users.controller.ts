import * as UsersService from "../services/users.service";
import { withErrorHandling } from "../helpers/withErrorHandling";
import { mapUsersToUserDTO, mapUserToMeDTO } from "../helpers/mappers";
import { getUserIdFromToken } from "../helpers/getUserIdFromToken";
import { getTokenFromRequest } from "../helpers/getTokenFromRequest";

export const getAllUsers = withErrorHandling(async (req, res) => {
  const { q } = req.query;

  const data = await UsersService.getAll(q);
  res.status(200).send(mapUsersToUserDTO(data));
});

export const getMe = withErrorHandling(async (req, res) => {
  const token = getTokenFromRequest(req);
  const id = getUserIdFromToken(token);

  const data = await UsersService.getUserById(id);

  res.status(200).send(mapUserToMeDTO(data));
});
