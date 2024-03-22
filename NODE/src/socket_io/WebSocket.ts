import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Connections, SOCKET_COMMIT, TYPE_CONNECTION_SOCKET } from '../common/socket';
import { redisController } from '../redis/RedisController';
import { MainkeysRedis } from '../interface/KeyRedisInterface';

interface UserSocketMap {
  [userId: string]: Socket;
}
export class WebSocket {
  private socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
  private userSocketMap: UserSocketMap = {};
  constructor(socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    this.socket_io = socket_io;
  }

  public socketIO() {
    this.socket_io.on(SOCKET_COMMIT.CONNECT, (socket: Socket) => {
      this.connected(socket);
      this.sendMessages(socket);
      this.disConnected(socket);
    });
  }

  public async sendMessageConsumber(message: string, channel: string) {
    const response = JSON.parse(message);
    const isMember = await redisController.sisMembers(MainkeysRedis.SOCKET_BY_USER, response.userId);
    if (!isMember) return;
    const socket = this.userSocketMap[response.userId];
    if (!socket) return;
    socket.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, response);
  }

  private connected(socket: Socket) {
    socket.on(SOCKET_COMMIT.JOIN_ROOM, async (connections: Connections) => {
      socket.join(connections.id);
      this.userSocketMap[connections.id] = socket;
      await this.addMemberConnections(connections);
    });
  }

  private disConnected(socket: Socket) {
    socket.on(SOCKET_COMMIT.DISCONNECTED, async (connections: Connections) => {
      await this.dellMemberConnections(connections);
      delete this.userSocketMap[connections.id];
    });
  }

  private sendMessages(socket: Socket) {
    socket.on(SOCKET_COMMIT.SEND_MESSAGE, (connections: Connections, dataMessages: any, callBackAcknow: Function) => {});
  }

  private async addMemberConnections(connections: Connections) {
    switch (connections.type) {
      case TYPE_CONNECTION_SOCKET.SHOP:
        return await redisController.saddMembers(MainkeysRedis.SOCKET_BY_SHOP, connections);
      case TYPE_CONNECTION_SOCKET.USER:
        return await redisController.saddMembers(MainkeysRedis.SOCKET_BY_USER, connections);
      default:
        break;
    }
  }

  private async dellMemberConnections(connections: Connections) {
    switch (connections.type) {
      case TYPE_CONNECTION_SOCKET.SHOP:
        return await redisController.sRemMembers(MainkeysRedis.SOCKET_BY_SHOP, connections);
      case TYPE_CONNECTION_SOCKET.USER:
        await redisController.delRedis(`${MainkeysRedis.SOCKET_BY_USER}${connections.id}`);
        return await redisController.sRemMembers(MainkeysRedis.SOCKET_BY_USER, connections);
      default:
        break;
    }
  }
}
