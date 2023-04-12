export type User = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  balance: number;
};

export type UserDTO = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type MeDTO = UserDTO & {
  balance: number;
};
