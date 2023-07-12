import { Request, Response } from 'express';
import { PaypalService } from '../services/paypal/PaypalService';
import { NameEventWebHook, PaymentSaleCompleted } from '../interface/SubscriptionInterface';
import { SubscriptionUseCase } from '../usecase/SubscriptionUseCase';
import { sequelize } from '../database/sequelize';

export class PaypalAppWebHookController {
  constructor(private paypalService: PaypalService, private subscriptionUseCase: SubscriptionUseCase) {}

  public eventListenerSubscription = async (req: Request, res: Response) => {
    try {
      const getEventData = res.req.body;
      if (!getEventData) {
        return res.status(404).json({ status: 'Response not found' });
      }
      // return res.status(200).json({ status: 'ok' });
      const requestBody = this.configHeader(res.req.rawHeaders, getEventData);
      const result = await this.paypalService.verifyWebhookSignature(requestBody);
      if (result && result.verification_status !== 'SUCCESS') {
        return res.status(401).json({ status: 'Authorization' });
      }
      const subscriptionId = getEventData.event_type === PaymentSaleCompleted.PAYMENT_SALE_COMPLETED ? getEventData.resource.billing_agreement_id : getEventData.resource.id;
      const subscription = await this.subscriptionUseCase.getSubscriptionBySubsIdUseCase(subscriptionId);
      if (subscription) {
        const transaction = await sequelize.transaction();
        try {
          if (getEventData.event_type === PaymentSaleCompleted.PAYMENT_SALE_COMPLETED) {
            await this.subscriptionUseCase.getInvoicesUserPaypal(getEventData.resource, subscription, transaction);
          }
          if (Object.values(NameEventWebHook).includes(getEventData.event_type)) {
            await this.subscriptionUseCase.configUserSubscription(getEventData.resource, subscription, transaction);
          }
          await transaction.commit();
        } catch (error) {
          await transaction.rollback();
          throw new Error(error);
        }
        return res.status(200).json({ status: 'ok' });
      }
      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      return res.status(404).json({ status: 'error' });
    }
  };

  private configHeader(header: any, requestBody: any) {
    return {
      transmission_id: header[header.indexOf('Paypal-Transmission-Id') + 1],
      transmission_time: header[header.indexOf('Paypal-Transmission-Time') + 1],
      transmission_sig: header[header.indexOf('Paypal-Transmission-Sig') + 1],
      cert_url: header[header.indexOf('Paypal-Cert-Url') + 1],
      auth_algo: header[header.indexOf('Paypal-Auth-Algo') + 1],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: requestBody
    };
  }
}
