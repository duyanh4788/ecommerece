import express, { Router } from 'express';
import seesion, { SessionOptions } from 'express-session';
import cors from 'cors';
import { Routers } from '../routers';
import * as bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { RequestLimitMiddleware } from '../middlewares/requestlimit/RequestLimitMiddleware';
import { SECRETKEY_SESSION } from '../common/common.constants';

const sessionOptions: SessionOptions = {
  secret: SECRETKEY_SESSION,
  resave: true,
  saveUninitialized: true
};

class App {
  public App: express.Application;
  public ApiRouter: Router;
  private routers: Routers = new Routers();
  private requestLimitMiddleware: RequestLimitMiddleware = new RequestLimitMiddleware();

  constructor() {
    this.ApiRouter = Router();
    this.App = express();
    this.configCors();
    this.configJson();
    this.validateRequestLimits();
    this.App.use('/api/v1', this.ApiRouter);
    this.routers.routes(this.ApiRouter);
  }

  public initStaticFile() {
    const publics = path.join(__dirname, '../../data_publish');
    const images = path.join(__dirname, '../../data_publish/images');
    const videos = path.join(__dirname, '../../data_publish/videos');

    if (!fs.existsSync(publics)) {
      fs.mkdirSync(publics, { recursive: true });
      console.log(`${publics} created successfully!`);
    }

    if (!fs.existsSync(images)) {
      fs.mkdirSync(images, { recursive: true });
      console.log(`${images} created successfully!`);
    }
    if (!fs.existsSync(videos)) {
      fs.mkdirSync(videos, { recursive: true });
      console.log(`${videos} created successfully!`);
    }

    global._pathFileImages = path.join(__dirname, '../../data_publish/images');
    global._pathFileVideo = path.join(__dirname, '../../data_publish/videos');
    this.App.use('/data_publish/images', express.static(_pathFileImages));
    this.App.use('/data_publish/videos', express.static(_pathFileVideo));
  }

  public configCors(): void {
    this.App.use(seesion(sessionOptions));
    this.App.use(
      cors({
        origin: process.env.END_POINT_HOME,
        credentials: true
      })
    );
  }

  public configJson(): void {
    this.App.use(bodyParser.json());
    this.App.use(bodyParser.urlencoded({ extended: false }));
    this.App.use(express.json({ limit: '50mb' }));
    this.App.use(express.urlencoded({ limit: '50mb', extended: false }));
    this.App.use(cookieParser());
    this.App.use(logger('dev'));
  }
  public validateRequestLimits() {
    this.App.use(this.requestLimitMiddleware.validateRequestLimit);
    setInterval(this.requestLimitMiddleware.processQueue, 1000);
  }
}

export default new App().App;
