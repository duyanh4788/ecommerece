import { InvoicesSequelize } from '../../database/sequelize/InvoicesSequelize';
import { SubscriptionSequelize } from '../../database/sequelize/SubscriptionSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { Subscription } from '../../interface/SubscriptionInterface';
import { redisController } from '../RedisController';

export class RedisSubscription {
  private subscriptionSequelize: SubscriptionSequelize = new SubscriptionSequelize();
  private invoicesSequelize: InvoicesSequelize = new InvoicesSequelize();
  static instance: RedisSubscription;

  private constructor() {}

  public static getInstance(): RedisSubscription {
    if (!RedisSubscription.instance) {
      RedisSubscription.instance = new RedisSubscription();
    }
    return RedisSubscription.instance;
  }

  public async adminGetListSubs() {
    let subsRedis = await redisController.getRedis(MainkeysRedis.ADMIN_SUBS);
    if (!subsRedis) {
      const subs = await this.subscriptionSequelize.findAll();
      if (!subs.length) return [];
      subsRedis = await redisController.setRedis({ keyValue: MainkeysRedis.ADMIN_SUBS, value: subs });
    }
    return subsRedis;
  }

  public async adminGetInv() {
    let invRedis = await redisController.getRedis(MainkeysRedis.ADMIN_INV);
    if (!invRedis) {
      const invs = await this.invoicesSequelize.findAllInvoices();
      if (!invs.length) return [];
      invRedis = await redisController.setRedis({ keyValue: MainkeysRedis.ADMIN_INV, value: invs });
    }
    return invRedis;
  }

  public async getSubsByShopId(shopId: string) {
    let subRedis = await redisController.getRedis(`${MainkeysRedis.SUBS_SHOPID}${shopId}`);
    if (!subRedis) {
      const sub = await this.subscriptionSequelize.findByShopId(shopId);
      if (!sub) return;
      subRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SUBS_SHOPID}${shopId}`, value: sub });
    }
    return subRedis;
  }

  public async getSubsBySubsId(subscriptionId: string) {
    let subsRedis = await redisController.getRedis(`${MainkeysRedis.SUBS_ID}${subscriptionId}`);
    if (!subsRedis) {
      const subs = await this.subscriptionSequelize.findBySubscriptionId(subscriptionId);
      if (!subs) return;
      subsRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SUBS_ID}${subscriptionId}`, value: subs });
    }
    return subsRedis;
  }

  public async getInvsByShopId(shopId: string) {
    let invsRedis = await redisController.getRedis(`${MainkeysRedis.INVS_ID}${shopId}`);
    if (!invsRedis) {
      const invs = await this.invoicesSequelize.findByShopId(shopId);
      if (!invs.length) return [];
      invsRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.INVS_ID}${shopId}`, value: invs });
    }
    return invsRedis;
  }

  public async handlerUpdateKeys(mainKeys: string, id: string, subscription: Subscription) {
    await redisController.setRedis({ keyValue: `${mainKeys}${id}`, value: subscription });
  }

  public async handlerDelKeys(mainKeys: string, id: string) {
    await redisController.delRedis(`${mainKeys}${id}`);
  }

  public async adminDelKeys(mainKeys: string) {
    await redisController.delRedis(mainKeys);
  }
}
