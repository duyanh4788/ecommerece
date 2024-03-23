import * as redis from 'redis';
import * as util from 'util';
import { envConfig } from '../config/envConfig';
import { MainkeysRedis } from '../interface/KeyRedisInterface';
import { webSocket } from '../server';

interface RedisCache {
  hasKey: string;
  key: string;
  values?: any;
}

interface RedisModel {
  keyValue: string;
  value?: any;
  timer?: number;
}

enum StatusRedis {
  CONNECT = 'connect',
  END = 'end',
  RE_CONNECT = 'reconnect',
  ERROR = 'error'
}

class RedisController {
  private REDIS_URL: string = envConfig.REDIS_URL as string;
  private client: redis.RedisClientType;
  private REDIS_TIMEOUT: number = 100000;
  private connectTimeOut: NodeJS.Timeout;

  constructor() {
    this.client = redis.createClient({ url: this.REDIS_URL });
    util.promisify(this.client.get).bind(this.client);
    this.subcriber(MainkeysRedis.CHANNLE_SHOP);
    this.subcriber(MainkeysRedis.CHANNLE_USER);
  }

  async connectRedis() {
    this.client.on(StatusRedis.CONNECT, () => {
      console.log('Redis server is running');
      this.clearConnectTimeOut();
    });
    this.client.on(StatusRedis.END, () => {
      console.log('Redis server is END');
      this.retryConnectRedis();
    });
    this.client.on(StatusRedis.RE_CONNECT, () => {
      console.log('Redis server is RE_CONNECT');
      this.clearConnectTimeOut();
    });
    this.client.on(StatusRedis.ERROR, (error) => {
      console.log(`Redis server is ${error}`);
      this.retryConnectRedis();
    });
    await this.client.connect();
  }

  async disconnectRedis() {
    await this.client.quit();
  }

  private retryConnectRedis() {
    this.connectTimeOut = setTimeout(() => {
      console.log('Retrying connection to Redis server...');
    }, this.REDIS_TIMEOUT);
  }

  private clearConnectTimeOut() {
    if (this.connectTimeOut) {
      clearTimeout(this.connectTimeOut);
    }
  }
  // SET
  async getRedis(keyValue: string) {
    const result = await this.client.get(keyValue);
    return JSON.parse(result as any);
  }
  async setRedis({ keyValue, value }: RedisModel) {
    await this.client.set(keyValue, JSON.stringify(value));
    const result = await this.client.get(keyValue);
    return JSON.parse(result as any);
  }
  async delRedis(keyValue: string) {
    return await this.client.del(keyValue);
  }
  // HSET
  async getAllHasRedis(hasKey: string) {
    const result = await this.client.hGetAll(hasKey);
    if (!Object.keys(result).length) return;
    return Object.values(result).map((item) => JSON.parse(item));
  }
  async getHasRedis({ hasKey, key }: RedisCache) {
    const result = await this.client.hGet(hasKey, key);
    return JSON.parse(result as any);
  }
  async setHasRedis({ hasKey, key, values }: RedisCache) {
    return await this.client.hSet(hasKey, key, JSON.stringify(values));
  }
  async delHashRedis({ hasKey, key }: RedisCache) {
    return await this.client.hDel(hasKey, key);
  }
  // SETS
  async saddMembersRedis(keyValue: string, value: any) {
    if (!value) return;
    return await this.client.sAdd(keyValue, value);
  }
  async sMembersRedis(keyValue: string): Promise<any[]> {
    return await this.client.sMembers(keyValue);
  }
  async sRemMembersRedis(keyValue: string, value: any) {
    if (!value) return;
    return await this.client.sRem(keyValue, value);
  }
  async sisMembersRedis(keyValue: string, id: any) {
    if (!id) return;
    return await this.client.sIsMember(keyValue, id);
  }

  async setNXRedis({ keyValue, value }: RedisModel) {
    await this.client.setNX(keyValue, JSON.stringify(value));
    const result = await this.client.get(keyValue);
    return JSON.parse(result as any);
  }
  async setExpire(keyValue: string, timer: number) {
    await this.client.expire(keyValue, timer);
    return;
  }
  async checkExistsKey(keyValue: string) {
    const result = await this.client.exists(keyValue);
    return JSON.parse(result as any);
  }
  async setIncreaseRedis(keyValue: any, value: any) {
    const result = await this.client.incrBy(keyValue, value);
    return JSON.parse(result as any);
  }

  async publisher(channelName: string, value: any) {
    await this.client.publish(channelName, JSON.stringify(value));
  }

  async subcriber(channelName: string) {
    const subscriber = this.client.duplicate();
    subscriber.on('error', (err) => console.error(err));
    await subscriber.connect();
    await subscriber.subscribe(channelName, (message: string, channel: string) => {
      webSocket.sendMessageConsumber(message, channel);
    });
  }
}
export const redisController = new RedisController();
