import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

import { router } from "./routes";
const PORT: Number = Number(process.env.PORT) || 5050;

const init = async () => {
  const app: Application = express();

  app.use(
    cors({
      credentials: true,
      origin: process.env.APP_URL,
    })
  );
  app.use(cookieParser());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use("/v1", router);
  app.use(errorMiddleware);

  app.use("/", (req: Request, res: Response, next: NextFunction): void => {
    res.json({});
  });
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
  }
  return app;
};

export default {
  init,
};
