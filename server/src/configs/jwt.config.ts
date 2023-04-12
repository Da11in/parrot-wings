import * as dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiresIn: "5m",
  refreshTokenExpiresIn: "7d",
};
