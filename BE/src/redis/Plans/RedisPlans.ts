import { PaypalBillingPlanSequelize } from '../../database/sequelize/PaypalBillingPlanSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { redisController } from '../RedisController';

export class RedisPlans {
  private paypalBillingPlanSequelize: PaypalBillingPlanSequelize = new PaypalBillingPlanSequelize();

  public async handlerGetPlans() {
    let plansRedis = await redisController.getRedis(MainkeysRedis.PLANS);
    if (!plansRedis) {
      const plans = await this.paypalBillingPlanSequelize.findAll();
      plansRedis = await redisController.setRedis({ keyValue: MainkeysRedis.PLANS, value: plans });
    }
    return plansRedis;
  }

  public async handlerGetPlanId(planId: string) {
    let planRedis = await redisController.getRedis(`${MainkeysRedis.PLAN_ID}${planId}`);
    if (!planRedis) {
      const plan = await this.paypalBillingPlanSequelize.finfByPlanId(planId);
      planRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.PLAN_ID}${planId}`, value: plan });
    }
    return planRedis;
  }

  public async handlerGetTier(tier: string) {
    let planRedis = await redisController.getRedis(`${MainkeysRedis.TIER}${tier}`);
    if (!planRedis) {
      const plan = await this.paypalBillingPlanSequelize.finfByTier(tier);
      planRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.TIER}${tier}`, value: plan });
    }
    return planRedis;
  }
}
