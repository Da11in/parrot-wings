import express from "express";
import bodyParser from "body-parser";

import { appConfig } from "./configs/app.config";

import { errorMiddleware } from "./middlewares";

import routes from "./routes";

const app = express();

app.use(bodyParser.json());
app.use("/api", routes);
app.use(errorMiddleware);

app.listen(appConfig.PORT, () => {
  console.log(`Example app listening on port ${appConfig.PORT}`);
});
