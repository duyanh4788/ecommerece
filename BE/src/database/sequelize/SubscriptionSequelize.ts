import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { ISubscriptionRepository } from '../../repository/ISubscriptionRepository';
import { Subscription } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';

export class SubscriptionSequelize implements ISubscriptionRepository {
  async findAll(): Promise<Subscription[]> {
    const subsciptions = await SubscriptionModel.findAll();
    return subsciptions.map((item) => this.transformModelToEntity(item));
  }

  async findByUserId(userId: string): Promise<Subscription> {
    const subs = await SubscriptionModel.findOne({
      where: { userId: deCryptFakeId(userId) },
      include: [{ model: PaypalBillingPlansModel, attributes: ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberIndex'] }]
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
    return this.transformModelToEntity(subs);
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
