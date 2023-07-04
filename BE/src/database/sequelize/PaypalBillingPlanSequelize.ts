import { IPaypalBillingPlanRepository } from '../../repository/IPaypalBillingPlanRepository';
import { PaypalBillingPlans } from '../../interface/SubscriptionInterface';
import { PaypalBillingPlansModel } from '../model/PaypalBillingPlansModel';

export class PaypalBillingPlanSequelize implements IPaypalBillingPlanRepository {
  private ATTRIBUTES: string[] = ['tier', 'planId', 'frequency', 'amount', 'numberProduct', 'numberItem'];
  async findAll(): Promise<PaypalBillingPlans[]> {
    const plans = await PaypalBillingPlansModel.findAll({
      where: { isTrial: true },
      attributes: this.ATTRIBUTES,
      order: [['amount', 'ASC']]
    });
    return plans.map((item) => this.transformModelToEntity(item));
  }

  async finfByPlanId(planId: string): Promise<PaypalBillingPlans> {
    const plan = await PaypalBillingPlansModel.findOne({ where: { planId } });
    return this.transformModelToEntity(plan);
  }

  async finfByTier(tier: string): Promise<PaypalBillingPlans> {
    const plan = await PaypalBillingPlansModel.findOne({ where: { tier } });
    return this.transformModelToEntity(plan);
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
