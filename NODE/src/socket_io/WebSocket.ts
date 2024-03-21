import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Connections, SOCKET_COMMIT, TYPE_CONNECTION_SOCKET } from '../common/socket';
import { redisController } from '../redis/RedisController';
import { MainkeysRedis } from '../interface/KeyRedisInterface';

export class WebSocket {
  constructor() {}

  public socketIO(socket_io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) {
    socket_io.on(SOCKET_COMMIT.CONNECT, (socket: Socket) => {
      /** Connect **/
      socket.on(SOCKET_COMMIT.JOIN_ROOM, async (connections: Connections) => {
        await this.addMemberConnections(connections);
      });
      /** send messages **/
      socket.on(SOCKET_COMMIT.SEND_MESSAGE, (connections: Connections, dataMessages: any, callBackAcknow: Function) => {
        const consumers = redisController.getMessageConsumber();
        console.log('channel_shop', consumers);
      });
      /** disconnect **/
      socket.on(SOCKET_COMMIT.DISCONNECTED, async (connections: Connections) => {
        await this.dellMemberConnections(connections);
      });
    });
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
