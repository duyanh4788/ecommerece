import { PaypalBillingPlans } from '../interface/SubscriptionInterface';

export interface IPaypalBillingPlanRepository {
  findAll(): Promise<PaypalBillingPlans[]>;

  finfByPlanId(planId: string): Promise<PaypalBillingPlans>;

  finfByTier(tier: string): Promise<PaypalBillingPlans>;
}
