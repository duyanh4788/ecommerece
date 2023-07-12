import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { ISubscriptionRepository } from '../../repository/ISubscriptionRepository';
import { Subscription, SubscriptionStatus } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';
import { RestError } from '../../services/error/error';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { ShopsResourcesModel } from '../model/ShopsResourcesModel';
import { ShopsModel } from '../model/ShopsModel';

export class SubscriptionSequelize implements ISubscriptionRepository {
  private INCLUDES: any[] = [
    { model: ShopsModel, attributes: ['nameShop'] },
    { model: PaypalBillingPlansModel, attributes: ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberItem'] },
    { model: ShopsResourcesModel, attributes: ['numberProduct', 'numberItem'] }
  ];
  async findAll(): Promise<Subscription[]> {
    const subsciptions = await SubscriptionModel.findAll();
    return subsciptions.map((item) => this.transformModelToEntity(item));
  }

  async findByShopId(shopId: string): Promise<Subscription> {
    const sub = await SubscriptionModel.findByPk(deCryptFakeId(shopId), { include: this.INCLUDES });
    return this.transformModelToEntity(sub);
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const subs = await SubscriptionModel.findAll({
      where: { userId: deCryptFakeId(userId) },
      include: this.INCLUDES
    });
    return subs.map((item) => this.transformModelToEntity(item));
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Subscription> {
    const subs = await SubscriptionModel.findOne({ where: { subscriptionId }, include: [{ model: ShopsModel, attributes: ['nameShop'] }] });
    return this.transformModelToEntity(subs);
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
    await this.handleRedis(result.shopId, result.subscriptionId, result.userId);
    return result;
  }

  async updateResponseSuccess(subscriptionId: string): Promise<void> {
    const find = await SubscriptionModel.findOne({
      where: { subscriptionId },
      include: this.INCLUDES
    });
    if (!find) {
      throw new RestError('subscription not available!', 404);
    }
    find.status = SubscriptionStatus.WAITING_SYNC;
    await find.save();
    const result = this.transformModelToEntity(find);
    await this.handleRedis(result.shopId, subscriptionId, result.userId);
    return;
  }

  private async handleRedis(shopId: string, subscriptionId: string, userId: string) {
    await RedisSubscription.getInstance().adminDelKeys(`${MainkeysRedis.SUBS_SHOPID}${shopId}`);
    await RedisSubscription.getInstance().adminDelKeys(`${MainkeysRedis.SHOPS_USERID}${userId}`);
    await RedisSubscription.getInstance().adminDelKeys(`${MainkeysRedis.SUBS_ID}${subscriptionId}`);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_SUBS);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_INV);
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
