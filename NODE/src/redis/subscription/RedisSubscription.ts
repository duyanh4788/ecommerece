import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { enCryptFakeId } from '../../utils/fakeid';
import { redisController } from '../RedisController';

export class RedisSubscription {
  static async delSubscriptionRedis(shopId: string, subscriptionId: string, userId: string = null) {
    await redisController.delRedis(`${MainkeysRedis.SUBS_SHOPID}${shopId}`);
    await redisController.delRedis(`${MainkeysRedis.SUBS_ID}${subscriptionId}`);
    await redisController.delRedis(MainkeysRedis.ADMIN_SUBS);
    await redisController.delRedis(MainkeysRedis.ADMIN_INV);
    if (userId) {
      await redisController.delRedis(`${MainkeysRedis.SHOPS_USERID}${userId}`);
    }
  }

  static async delResourceRedis(shopId: string, resourceId: number) {
    await redisController.delRedis(`${MainkeysRedis.SHOP_RESOURCE_SHOPID}${shopId}`);
    await redisController.delRedis(`${MainkeysRedis.SHOP_RESOURCE_ID}${enCryptFakeId(resourceId)}`);
  }
}
