import { AuthenticatesCodesSequelize } from '../../database/sequelize/AuthenticatesCodesSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { redisController } from '../RedisController';

export class RedisAuthenticate {
  private authenticatesCodesSequelize: AuthenticatesCodesSequelize = new AuthenticatesCodesSequelize();
  static instance: RedisAuthenticate;

  private constructor() {}

  public static getInstance(): RedisAuthenticate {
    if (!RedisAuthenticate.instance) {
      RedisAuthenticate.instance = new RedisAuthenticate();
    }
    return RedisAuthenticate.instance;
  }

  public async getByUserId(userId: string) {
    let authRedis = await redisController.getRedis(`${MainkeysRedis.AUTH_USERID}${userId}`);
    if (!authRedis) {
      const auth = await this.authenticatesCodesSequelize.findByUserId(userId);
      if (!auth) return;
      authRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.AUTH_USERID}${userId}`, value: auth });
    }
    return authRedis;
  }

  public async getByCode(authCode: string) {
    let authRedis = await redisController.getRedis(`${MainkeysRedis.AUTH_CODE}${authCode}`);
    if (!authRedis) {
      const auth = await this.authenticatesCodesSequelize.findByAuthCode(authCode);
      if (!auth) return;
      authRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.AUTH_CODE}${authCode}`, value: auth });
    }
    return authRedis;
  }

  public async handlerDelKeys(mainKeys: string, id: string) {
    await redisController.delRedis(`${mainKeys}${id}`);
  }
}
