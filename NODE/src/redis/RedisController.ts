import * as redis from 'redis';
import * as util from 'util';
import { envConfig } from '../config/envConfig';
import { MainkeysRedis } from '../interface/KeyRedisInterface';

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
  private messageConsumber: string = '';

  constructor() {
    this.client = redis.createClient({ url: this.REDIS_URL });
    this.subcriber(MainkeysRedis.CHANNLE_SHOP);
    this.subcriber(MainkeysRedis.CHANNLE_USER);
    util.promisify(this.client.get).bind(this.client);
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

  async getHasRedis({ hasKey, key }: RedisCache) {
    const result = await this.client.hGet(hasKey, key);
    return JSON.parse(result as any);
  }

  async setHasRedis({ hasKey, key, values }: RedisCache) {
    return await this.client.hSet(hasKey, key, JSON.stringify(values));
  }

  async clearHashRedis(key: string) {
    return await this.client.del(JSON.stringify(key));
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

  async saddMembers(keyValue: any, value: any) {
    if (!value.id) return;
    return await this.client.sAdd(keyValue, value.id);
  }

  async sRemMembers(keyValue: any, value: any) {
    if (!value.id) return;
    return await this.client.sRem(keyValue, value.id);
  }

  async publisher(channelName: string, value: string) {
    await this.client.publish(channelName, value);
  }

  async subcriber(channelName: string) {
    const subscriber = this.client.duplicate();
    subscriber.on('error', (err) => console.error(err));
    await subscriber.connect();
    await subscriber.subscribe(channelName, (message: string, channel: string) => {
      this.messageConsumber = message;
    });
  }

  public getMessageConsumber() {
    return this.messageConsumber;
  }
}
export const redisController = new RedisController();
