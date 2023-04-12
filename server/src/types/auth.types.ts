export type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequest = Pick<SignupRequest, "email" | "password">;

export type RefreshTokenRequest = {
  refreshToken: string;
};
