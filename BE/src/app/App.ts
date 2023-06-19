import express, { Router } from "express";
import seesion, { SessionOptions } from "express-session";
import cors from "cors";
import { Routers } from "../routers";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { RequestLimitMiddleware } from "../middlewares/requestlimit/RequestLimitMiddleware";
import { SECRETKEY } from "../common/common.constants";

const sessionOptions: SessionOptions = {
  secret: SECRETKEY,
  resave: true,
  saveUninitialized: true,
};

class App {
  public App: express.Application;
  public ApiRouter: Router;
  private routers: Routers = new Routers();
  private requestLimitMiddleware: RequestLimitMiddleware =
    new RequestLimitMiddleware();

  constructor() {
    this.ApiRouter = Router();
    this.App = express();
    this.configCors();
    this.configJson();
    this.validateRequestLimits();
    this.App.use("/api/v1", this.ApiRouter);
    this.routers.routes(this.ApiRouter);
  }

  public configCors(): void {
    this.App.use(seesion(sessionOptions));
    this.App.use(
      cors({
        origin: process.env.END_POINT_HOME,
        credentials: true,
      })
    );
  }

  public configJson(): void {
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(express.json({ limit: "50mb" }));
    this.App.use(express.urlencoded({ limit: "50mb", extended: false }));
    this.App.use(cookieParser());
    this.App.use(logger("dev"));
  }
  public validateRequestLimits() {
    this.App.use(this.requestLimitMiddleware.validateRequestLimit);
    setInterval(this.requestLimitMiddleware.processQueue, 1000);
  }
}

export default new App().App;
