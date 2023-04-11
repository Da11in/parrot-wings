import express from "express";

import { appConfig } from "./configs/app.config";

import routes from "./routes";

const app = express();

app.use("/api", routes);

app.listen(appConfig.PORT, () => {
  console.log(`Example app listening on port ${appConfig.PORT}`);
});
