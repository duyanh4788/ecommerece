import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { ISubscriptionRepository } from '../../repository/ISubscriptionRepository';
import { Subscription, SubscriptionStatus } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';
import { RestError } from '../../services/error/error';
import { UsersResourcesModel } from '../model/UsersResourcesModel';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class SubscriptionSequelize implements ISubscriptionRepository {
  async findAll(): Promise<Subscription[]> {
    const subsciptions = await SubscriptionModel.findAll();
    return subsciptions.map((item) => this.transformModelToEntity(item));
  }

  async findByUserId(userId: string): Promise<Subscription> {
    const subs = await SubscriptionModel.findOne({
      where: { userId: deCryptFakeId(userId) },
      include: [
        { model: PaypalBillingPlansModel, attributes: ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberIndex'] },
        { model: UsersResourcesModel, attributes: ['numberProduct', 'numberIndex'] }
      ]
    });
    return this.transformModelToEntity(subs);
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Subscription> {
    const subs = await SubscriptionModel.findOne({ where: { subscriptionId } });
    return this.transformModelToEntity(subs);
  }

  async createOrUpdate(reqBody: Subscription, transactionDB: Transaction): Promise<Subscription> {
    const { userId, subscriptionId, lastPaymentsFetch, paymentProcessor, planId, isTrial, status } = reqBody;
    const [subs, created] = await SubscriptionModel.findOrCreate({
      where: { userId: deCryptFakeId(userId) },
      defaults: { subscriptionId, lastPaymentsFetch, paymentProcessor, planId, status, isTrial }
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
    await this.handleRedis(result.userId, subscriptionId, result);
    return result;
  }

  async updateResponseSuccess(subscriptionId: string): Promise<void> {
    const find = await SubscriptionModel.findOne({ where: { subscriptionId } });
    if (!find) {
      throw new RestError('subscription not available!', 404);
    }
    find.status = SubscriptionStatus.WAITING_SYNC;
    await find.save();
    const result = this.transformModelToEntity(find);
    await this.handleRedis(result.userId, subscriptionId, result);
    return;
  }

  private async handleRedis(userId: string, subscriptionId: string, result: Subscription) {
    await RedisSubscription.getInstance().handlerUpdateKeys(MainkeysRedis.SUBS_USERID, userId, result);
    await RedisSubscription.getInstance().handlerUpdateKeys(MainkeysRedis.SUBS_ID, subscriptionId, result);
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
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
