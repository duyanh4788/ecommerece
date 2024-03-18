import { IPaypalBillingPlanRepository } from '../../repository/IPaypalBillingPlanRepository';
import { PaypalBillingPlans } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class PaypalBillingPlanSequelize implements IPaypalBillingPlanRepository {
  private ATTRIBUTES: string[] = ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberItem'];

  async findAll(): Promise<PaypalBillingPlans[]> {
    let plansRedis = await redisController.getRedis(MainkeysRedis.PLANS);
    if (!plansRedis) {
      const plansModel = await PaypalBillingPlansModel.findAll({
        where: { isTrial: true },
        attributes: this.ATTRIBUTES,
        order: [['amount', 'ASC']]
      });
      plansRedis = await redisController.setRedis({ keyValue: MainkeysRedis.PLANS, value: plansModel.map((item) => this.transformModelToEntity(item)) });
    }
    return plansRedis;
  }

  async finfByPlanId(planId: string): Promise<PaypalBillingPlans> {
    const key = `${MainkeysRedis.PLAN_ID}${planId}`;
    let planRedis = await redisController.getRedis(key);
    if (!planRedis) {
      const plan = await PaypalBillingPlansModel.findOne({ where: { planId } });
      planRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(plan) });
    }
    return planRedis;
  }

  async finfByTier(tier: string): Promise<PaypalBillingPlans> {
    const key = `${MainkeysRedis.TIER}${tier}`;
    let planRedis = await redisController.getRedis(key);
    if (!planRedis) {
      const plan = await PaypalBillingPlansModel.findOne({ where: { tier } });
      planRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(plan) });
    }
    return planRedis;
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: PaypalBillingPlansModel): PaypalBillingPlans {
    if (!model) return;
    const entity: any = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    return entity;
  }
}
