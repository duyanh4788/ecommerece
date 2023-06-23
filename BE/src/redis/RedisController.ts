import * as redis from 'redis';
import * as util from 'util';

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

class RedisController {
  private REDIS_URL: string = process.env.REDIS_URL as string;
  private TIMER: number = 3600;
  private client: redis.RedisClientType;

  constructor() {
    this.client = redis.createClient({ url: this.REDIS_URL });
    util.promisify(this.client.get).bind(this.client);
    this.connectRedis();
  }

  async connectRedis() {
    await this.client.connect();
  }

  async disconnectRedist() {
    await this.client.quit();
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

  async checkExitsKey(keyValue: string) {
    const result = await this.client.exists(keyValue);
    return JSON.parse(result as any);
  }

  async setIncreaseRedis(keyValue: any, value: any) {
    const result = await this.client.incrBy(keyValue, value);
    return JSON.parse(result as any);
  }
}

export const redisController = new RedisController();
