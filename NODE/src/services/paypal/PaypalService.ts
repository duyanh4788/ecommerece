import rp from 'request-promise';
import { RestError } from '../error/error';

export class PaypalService {
  accessToken: string;
  expiresAt: Date;

  static TIME_BUFFER = 60000; // if token expires in 1 min, get new one to avoid unauthorised access
  static RESPONSE_PAYPAL_SUCCESS = process.env.SERVER_URL + '/api/v1/subscriptions/response-success';
  static RESPONSE_PAYPAL_CANCEL = process.env.FE_URL + '/home';
  static PAYPAL_ENDPOINT = 'https://api-m.sandbox.paypal.com/v1';
  constructor() {
    this.accessToken = null;
    this.expiresAt = new Date();
  }

  private async getAccessToken() {
    if (!this.accessToken || this.expiresAt.getTime() - new Date().getTime() < PaypalService.TIME_BUFFER) {
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const secret = process.env.PAYPAL_CLIENT_SECRET;
      const auth = `Basic ${Buffer.from(clientId + ':' + secret).toString('base64')}`;
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          authorization: auth
        },
        form: { grant_type: 'client_credentials' },
        json: true
      };
      const res = await rp(options);
      this.accessToken = res.access_token;
    }
  }

  async getBillingAgreement(billingAgreementId: string): Promise<any> {
    await this.getAccessToken();
    const options = {
      method: 'GET',
      url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${billingAgreementId}`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this.accessToken}`
      },
      json: true
    };
    try {
      const res = await rp(options);
      return res;
    } catch (e) {
      throw new RestError('can not get information subsciption', 404);
    }
  }

  async subscribeToBillingPlan(paypalPlanId: string, emailAddress: string): Promise<any> {
    await this.getAccessToken();
    try {
      const payload = {
        plan_id: paypalPlanId,
        subscriber: {
          email_address: emailAddress
        },
        application_context: {
          brand_name: 'Ecommerce AnhVu',
          locale: 'en-US',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          },
          return_url: PaypalService.RESPONSE_PAYPAL_SUCCESS,
          cancel_url: PaypalService.RESPONSE_PAYPAL_CANCEL
        }
      };
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: payload,
        json: true
      };
      const res = await rp(options);
      return {
        subscriptionId: res.id,
        confirmationLink: res.links.find((link) => link.rel === 'approve').href
      };
    } catch (error) {
      throw new RestError('system subscriber bussy, please try again or contact admin!', 404);
    }
  }

  async cancelSubscription(subscriptionId: string, reason: string) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${subscriptionId}/cancel`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: { reason },
        json: true
      };
      return await rp(options);
    } catch (error) {
      throw new RestError('You cannot canceled this subscription', 404);
    }
  }

  async suspendedSubscription(subscriptionId: string, reason: string) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${subscriptionId}/suspend`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: { reason },
        json: true
      };
      return await rp(options);
    } catch (error) {
      throw new RestError('You cannot suspended this subscription', 404);
    }
  }

  async activatedSubscription(subscriptionId: string, reason: string) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${subscriptionId}/activate`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: { reason },
        json: true
      };
      return await rp(options);
    } catch (error) {
      throw new RestError('You cannot activated this subscription', 404);
    }
  }

  async getTransactions(paypalSubscriptionId: string, startTime: Date, endTime: Date) {
    await this.getAccessToken();
    try {
      var options = {
        method: 'GET',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${paypalSubscriptionId}/transactions?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.accessToken}`
        },
        json: true
      };
      const response = await rp(options);
      return response;
    } catch (e) {
      throw new RestError('System bussy, please try again or contact admin', 404);
    }
  }

  async changeSubscriptions(paypalPlanId: string, subscriptionId: string, emailAddress: string) {
    try {
      const payload = {
        plan_id: paypalPlanId,
        subscriber: {
          email_address: emailAddress
        },
        application_context: {
          brand_name: 'Ecommerce AnhVu',
          locale: 'en-US',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
          },
          return_url: PaypalService.RESPONSE_PAYPAL_SUCCESS,
          cancel_url: PaypalService.RESPONSE_PAYPAL_CANCEL
        }
      };
      await this.getAccessToken();
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/billing/subscriptions/${subscriptionId}/revise`,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: payload,
        json: true
      };
      const res = await rp(options);
      return {
        confirmationLink: res.links.find((link) => link.rel === 'approve').href
      };
    } catch (e) {
      throw new RestError('System bussy, please try again or contact admin', 404);
    }
  }

  async showWebhookDetails(webhook_id: string) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'GET',
        url: `${PaypalService.PAYPAL_ENDPOINT}/notifications/webhooks/${webhook_id}`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.accessToken}`
        },
        json: true
      };
      const res = await rp(options);
      return res;
    } catch (error) {
      return;
    }
  }

  async showEventWebhookDetails(event_id: string) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'GET',
        url: `${PaypalService.PAYPAL_ENDPOINT}/notifications/webhooks-events/${event_id}`,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.accessToken}`
        },
        json: true
      };
      const res = await rp(options);
      return res;
    } catch (error) {
      return;
    }
  }

  async verifyWebhookSignature(payload: any) {
    try {
      await this.getAccessToken();
      const options = {
        method: 'POST',
        url: `${PaypalService.PAYPAL_ENDPOINT}/notifications/verify-webhook-signature`,
        json: true,
        body: payload,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        }
      };
      const res = await rp(options);
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
}
