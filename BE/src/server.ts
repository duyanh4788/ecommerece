import dotenv from 'dotenv';
dotenv.config();
import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { sequelize } from './database/sequelize';

export const isDevelopment = process.env.APP_ENV === 'develop' ? true : false;

// ********************* Connect DataBase *********************//
sequelize.sync({ force: false, alter: false });

// ********************* Config Server *********************//
const APP_PORT: string | number | any = process.env.APP_PORT || 8000;
const httpServer: http.Server = http.createServer(App);

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}

httpServer.listen(APP_PORT, () => {
  console.log(`Running API on port : ${APP_PORT}`);
});
