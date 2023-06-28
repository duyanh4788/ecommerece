import { httpRequest } from 'services/request';
import { SubScriptionApi } from '../constants/subscription.constant';
import { PaypalBillingPlans, Subscription } from 'interface/Subscriptions.model';

export class SubscriptionHttp {
  private configTier = (subs: PaypalBillingPlans) => {
    return {
      tier: subs.tier,
    };
  };

  private configCancel = (subs: Subscription) => {
    return {
      subscriptionId: subs.subscriptionId,
      reason: subs.reason,
    };
  };
  public getPlans = (): Promise<any> => {
    return httpRequest().get(SubScriptionApi.GET_PLANS);
  };

  public userGetSubscription = (): Promise<any> => {
    return httpRequest().get(SubScriptionApi.USER_GET_SUBSCRIPTION);
  };

  public userGetInvoices = (): Promise<any> => {
    return httpRequest().get(SubScriptionApi.USER_GET_INVOICES);
  };

  public userSubscriber = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.USER_SUBSCRIBER, this.configTier(data));
  };

  public userChanged = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.USER_CHANGE_SUBS, this.configTier(data));
  };

  public userCanceled = (data: any): Promise<any> => {
    return httpRequest().post(SubScriptionApi.USER_CANCELED_SUBS, this.configCancel(data));
  };
}
