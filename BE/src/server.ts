import dotenv from 'dotenv';
dotenv.config();
import App from './app/App';
import { Request, Response } from 'express';
import * as http from 'http';
import { WebSocket } from './socket_io/WebSocket';
import { Server } from 'socket.io';

export const isDevelopment = process.env.APP_ENV === 'local' ? true : false;

// ********************* Config Server *********************//
const APP_PORT: string | number = process.env.APP_PORT || 8001;
const httpServer: http.Server = http.createServer(App);

const configIo = new Server(httpServer, {
  cors: {
    origin: process.env.APP_URL,
    credentials: true
  }
});

const socket = new WebSocket();
socket.socketIO(configIo);

if (isDevelopment) {
  App.get('/', (req: Request, res: Response) => {
    res.send('Server is Running ...');
  });
}

httpServer.listen(APP_PORT, () => {
  console.log(`Running API on port : ${APP_PORT}`);
});
