import { httpRequest } from 'services/request';
import { SubScriptionApi } from '../constants/subscription.constant';
import { PaypalBillingPlans, Subscription } from 'interface/Subscriptions.model';

export class SubscriptionHttp {
  private configTier = (subs: PaypalBillingPlans) => {
    return {
      tier: subs.tier,
      shopId: subs.shopId,
    };
  };

  private configCancel = (subs: Subscription) => {
    return {
      subscriptionId: subs.subscriptionId,
      shopId: subs.shopId,
      reason: subs.reason,
    };
  };
  public getPlans = (): Promise<any> => {
    return httpRequest().get(SubScriptionApi.GET_PLANS);
  };

  public shopGetSubscription = (shopId: string): Promise<any> => {
    return httpRequest().get(SubScriptionApi.SHOP_GET_SUBSCRIPTION + shopId);
  };

  public shopGetInvoices = (shopId: string): Promise<any> => {
    return httpRequest().get(SubScriptionApi.SHOP_GET_INVOICES + shopId);
  };

  public shopSubscriber = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.SHOP_SUBSCRIBER, this.configTier(data));
  };

  public shopChanged = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.SHOP_CHANGE_SUBS, this.configTier(data));
  };

  public shopCanceled = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.SHOP_CANCELED_SUBS, this.configCancel(data));
  };
}
