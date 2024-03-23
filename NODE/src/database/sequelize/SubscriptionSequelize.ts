import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { ISubscriptionRepository } from '../../repository/ISubscriptionRepository';
import { Subscription, SubscriptionStatus } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';
import { RestError } from '../../services/error/error';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { ShopsResourcesModel } from '../model/ShopsResourcesModel';
import { ShopsModel } from '../model/ShopsModel';
import { redisController } from '../../redis/RedisController';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { Messages } from '../../common/messages';

export class SubscriptionSequelize implements ISubscriptionRepository {
  private INCLUDES: any[] = [
    { model: ShopsModel, attributes: ['nameShop'] },
    { model: PaypalBillingPlansModel, attributes: ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberItem'] },
    { model: ShopsResourcesModel, attributes: ['numberProduct', 'numberItem'] }
  ];

  async findAll(): Promise<Subscription[]> {
    let subsRedis = await redisController.getRedis(MainkeysRedis.ADMIN_SUBS);
    if (!subsRedis) {
      const subs = await SubscriptionModel.findAll();
      if (!subs.length) return [];
      subsRedis = await redisController.setRedis({ keyValue: MainkeysRedis.ADMIN_SUBS, value: subs });
    }
    return subsRedis;
  }

  async findByShopId(shopId: string): Promise<Subscription> {
    const key = `${MainkeysRedis.SUBS_SHOPID}${shopId}`;
    let subRedis = await redisController.getRedis(key);
    if (!subRedis) {
      const subModel = await SubscriptionModel.findByPk(deCryptFakeId(shopId), { include: this.INCLUDES });
      if (!subModel) return;
      subRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(subModel) });
    }
    return subRedis;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const key = `${MainkeysRedis.SUBS_USERID}${userId}`;
    let subRedis = await redisController.getRedis(key);
    if (!subRedis) {
      const subModel = await SubscriptionModel.findAll({
        where: { userId: deCryptFakeId(userId) },
        include: this.INCLUDES
      });
      if (!subModel.length) return;
      subRedis = await redisController.setRedis({ keyValue: key, value: subModel.map((item) => this.transformModelToEntity(item)) });
    }
    return subRedis;
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Subscription> {
    const key = `${MainkeysRedis.SUBS_ID}${subscriptionId}`;
    let subsRedis = await redisController.getRedis(key);
    if (!subsRedis) {
      const subModel = await SubscriptionModel.findOne({ where: { subscriptionId }, include: [{ model: ShopsModel, attributes: ['nameShop'] }] });
      if (!subModel) return;
      subsRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(subModel) });
    }
    return subsRedis;
  }

  async createOrUpdate(reqBody: Subscription, transactionDB: Transaction): Promise<Subscription> {
    const { shopId, userId, subscriptionId, lastPaymentsFetch, paymentProcessor, planId, isTrial, eventType, status } = reqBody;
    const [subs, created] = await SubscriptionModel.findOrCreate({
      where: { shopId: deCryptFakeId(shopId) },
      defaults: { subscriptionId, lastPaymentsFetch, paymentProcessor, planId, status, isTrial, eventType, userId: deCryptFakeId(userId) },
      include: this.INCLUDES
    });
    if (!created) {
      if (subscriptionId) {
        subs.subscriptionId = subscriptionId;
      }
      if (lastPaymentsFetch) {
        subs.lastPaymentsFetch = lastPaymentsFetch;
      }
      if (paymentProcessor) {
        subs.paymentProcessor = paymentProcessor;
      }
      if (planId) {
        subs.planId = planId;
      }
      if (status) {
        subs.status = status;
      }
      if (eventType) {
        subs.eventType = eventType;
      }
      if (isTrial !== undefined) {
        subs.isTrial = isTrial;
      }
      if (transactionDB) {
        await subs.save({ transaction: transactionDB });
      }
      if (!transactionDB) {
        await subs.save();
      }
    }
    const result = this.transformModelToEntity(subs);
    await RedisSubscription.delSubscriptionRedis(result.shopId, result.subscriptionId, result.userId);
    return result;
  }

  async updateResponseSuccess(subscriptionId: string): Promise<void> {
    const find = await SubscriptionModel.findOne({
      where: { subscriptionId },
      include: this.INCLUDES
    });
    if (!find) {
      throw new RestError(Messages.NOT_AVAILABLE, 404);
    }
    find.status = SubscriptionStatus.WAITING_SYNC;
    await find.save();
    const result = this.transformModelToEntity(find);
    await RedisSubscription.delSubscriptionRedis(result.shopId, result.subscriptionId, result.userId);
    return;
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: SubscriptionModel): Subscription {
    if (!model) return;
    const entity: any = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.shopId = enCryptFakeId(entity.shopId);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
