import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Connections, SOCKET_COMMIT, TYPE_CONNECTION_SOCKET } from '../common/socket';
import { redisController } from '../redis/RedisController';
import { MainkeysRedis } from '../interface/KeyRedisInterface';

export class WebSocket {
  private socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
  private socketClient: Socket;
  constructor(socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    this.socket_io = socket_io;
  }

  public socketIO() {
    this.socket_io.on(SOCKET_COMMIT.CONNECT, (socket: Socket) => {
      this.socketClient = socket;
      this.connected(socket);
      this.sendMessages(socket);
      this.disConnected(socket);
    });
  }

  public async sendMessageConsumber(userId: string, channel: string) {
    // const isMember = await redisController.sisMembers(MainkeysRedis.SOCKET_BY_USER, userId);
    // if (!isMember) return;
    console.log(userId);
    this.socketClient.broadcast.emit(SOCKET_COMMIT.SEND_MESSAGE_NOTIFY, { messages: userId, channel, code: 200 });
  }

  private connected(socket: Socket) {
    socket.on(SOCKET_COMMIT.JOIN_ROOM, async (connections: Connections) => {
      socket.join(connections.id);
      await this.addMemberConnections(connections);
    });
  }

  private disConnected(socket: Socket) {
    socket.on(SOCKET_COMMIT.DISCONNECTED, async (connections: Connections) => {
      await this.dellMemberConnections(connections);
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
        return await redisController.sRemMembers(MainkeysRedis.SOCKET_BY_USER, connections);
      default:
        break;
    }
  }
}
