import dotenv from 'dotenv';
dotenv.config();
import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { MonitorSystem } from './monitor/MonitorSystem';
import { envConfig } from './config/envConfig';
import { redisController } from './redis/RedisController';
import { mySqlController } from './database/MysqlController';
import { Server } from 'socket.io';
import { WebSocket } from './socket_io/WebSocket';

export const isDevelopment = envConfig.APP_ENV === 'develop' ? true : false;

// ********************* Connect DataBase *********************//
mySqlController.connectDb();

// ********************* Connect Redis *********************//
redisController.connectRedis();
redisController.subcriber('channel_shop:');

// ********************* Monitor System *********************//
new MonitorSystem().readMonitorSystem();

// ********************* Config Server *********************//
const APP_PORT: string | number | any = envConfig.APP_PORT || 8000;
const httpServer: http.Server = http.createServer(App);

const configIo = new Server(httpServer, {
  cors: {
    origin: envConfig.FE_URL,
    credentials: true
  }
});

const socket = new WebSocket();
socket.socketIO(configIo);

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('API server is Running ...');
  });
}

httpServer.listen(APP_PORT, () => {
  console.log(`System server is running on port : ${APP_PORT}`);
});
