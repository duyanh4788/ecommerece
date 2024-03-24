import { Transaction } from 'sequelize';
import { PaypalService } from '../services/paypal/PaypalService';
import { ISubscriptionRepository } from '../repository/ISubscriptionRepository';
import { IInvoicesRepository } from '../repository/IInvoicesRepository';
import { EventType, Invoices, PaypalBillingPlans, RequestEmail, Subscription, SubscriptionStatus } from '../interface/SubscriptionInterface';
import { UserAttributes } from '../interface/UserInterface';
import { RestError } from '../services/error/error';
import { nodeMailerServices } from '../services/nodemailer/MailServices';
import { capitalizeFirstLetter } from '../utils/accents';
import { IShopRepository } from '../repository/IShopRepository';
import { ShopInterface } from '../interface/ShopInterface';
import { IShopsResourcesRepository } from '../repository/IShopsResourcesRepository';
import { IPaypalBillingPlanRepository } from '../repository/IPaypalBillingPlanRepository';
import { IUserRepository } from '../repository/IUserRepository';
import { Messages } from '../common/messages';
import { PaymentProcessor } from '../common/variable';
import { TypePushlisher } from '../interface/KeyRedisInterface';

export class SubscriptionUseCase {
  constructor(
    private paypalService: PaypalService,
    private paypalBillingPlanRepository: IPaypalBillingPlanRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private invoicesRepository: IInvoicesRepository,
    private shopsResourcesRepository: IShopsResourcesRepository,
    private shopRepository: IShopRepository,
    private userRepository: IUserRepository
  ) {}

  async adminFindAllSubscriptionUseCase() {
    return await this.subscriptionRepository.findAll();
  }

  async adminFindAllInvoicesUseCase() {
    return await this.invoicesRepository.findAllInvoices();
  }

  async findAllPlanUseCase() {
    return await this.paypalBillingPlanRepository.findAll();
  }

  async finfByPlanIdUseCase(planId: string) {
    return await this.paypalBillingPlanRepository.finfByPlanId(planId);
  }

  async shopGetSubscriptionUseCase(shopId: string) {
    return await this.subscriptionRepository.findByShopId(shopId);
  }

  async shopGetInvoicesUseCase(shopId: string) {
    return await this.invoicesRepository.findByShopId(shopId);
  }

  async getSubscriptionBySubsIdUseCase(subscriptionId: string) {
    return await this.subscriptionRepository.findBySubscriptionId(subscriptionId);
  }

  async subscriberUseCase(tier: string, shopId: string, userId: string, transactionDB: Transaction) {
    const subscription = await this.subscriptionRepository.findByShopId(shopId);
    const user = await this.userRepository.findById(userId);
    if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
      throw new RestError(Messages.ALREADY_ACTIVE, 404);
    }
    if (subscription && subscription.status === SubscriptionStatus.SUSPENDED) {
      throw new RestError(Messages.SUBSCRIPTION_SUSPENDED, 404);
    }
    if (subscription && subscription.status === SubscriptionStatus.WAITING_SYNC) {
      throw new RestError(Messages.PLEASE_WAITING_SYNC, 404);
    }
    const checkTier = (subscription && !subscription.isTrial) || (subscription && subscription.status === SubscriptionStatus.CANCELLED) ? `${tier}_no_trial` : tier;
    const plan: PaypalBillingPlans = await this.paypalBillingPlanRepository.finfByTier(checkTier);
    try {
      if (subscription && subscription.status === SubscriptionStatus.APPROVAL_PENDING && subscription.planId === plan.planId) {
        const agreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
        return agreement.links.find((link) => link.rel === 'approve').href;
      }
      if (subscription && subscription.status === SubscriptionStatus.APPROVAL_PENDING && subscription.planId !== plan.planId) {
        const payload: Subscription = {
          shopId: subscription.shopId,
          userId: user.id,
          planId: plan.planId
        };
        const agreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
        await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
        return agreement.links.find((link) => link.rel === 'approve').href;
      }
      if (!subscription || (subscription && subscription.status === SubscriptionStatus.CANCELLED)) {
        return this.createSubscription(user, shopId, plan.planId, subscription, transactionDB);
      }
    } catch (error) {
      return this.createSubscription(user, shopId, plan.planId, subscription, transactionDB);
    }
  }

  private async createSubscription(userInfo: UserAttributes, shopId: string, planId: string, subscription: Subscription, transactionDB: Transaction) {
    const response = await this.paypalService.subscribeToBillingPlan(planId, userInfo.email);
    const { subscriptionId, confirmationLink } = response;
    const isTrial = subscription && subscription.status === SubscriptionStatus.CANCELLED ? false : true;
    const payload: Subscription = {
      shopId,
      userId: userInfo.id,
      subscriptionId,
      lastPaymentsFetch: new Date(),
      paymentProcessor: PaymentProcessor.PAYPAL,
      planId: planId,
      isTrial,
      status: SubscriptionStatus.APPROVAL_PENDING,
      eventType: EventType.NOMORAL
    };
    await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
    return confirmationLink;
  }

  async cancelUseCase(subscriptionId: string, reason: string, shopId: string, userId: string) {
    const subscription = await this.subscriptionRepository.findByShopId(shopId);
    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new RestError(Messages.NONE_SUB_TO_CANCEL, 400);
    }
    if (subscription.subscriptionId !== subscriptionId || subscription.userId !== userId) {
      throw new RestError(Messages.SUB_NOT_AVAILABLE, 400);
    }
    await this.paypalService.cancelSubscription(subscriptionId, reason);
    return;
  }

  async changeUseCase(tier: string, shopId: string, userId: string) {
    const userInfo = await this.userRepository.findById(userId);
    const subscription = await this.subscriptionRepository.findByShopId(shopId);
    if (!subscription || subscription.userId !== userId) {
      throw new RestError(Messages.NONE_SUBSCRIPTION, 404);
    }
    if (subscription && subscription.status === SubscriptionStatus.WAITING_SYNC) {
      throw new RestError(Messages.PLEASE_WAITING_SYNC, 404);
    }
    if (subscription && subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new RestError(Messages.CHANGE_SUBSCRIPTION, 404);
    }
    const checkTier = subscription.status === SubscriptionStatus.ACTIVE || !subscription.isTrial ? `${tier}_no_trial` : tier;
    const plan: PaypalBillingPlans = await this.paypalBillingPlanRepository.finfByTier(checkTier);
    if (subscription.planId === plan.planId) {
      throw new RestError(Messages.PLAN_DUPLICATE, 404);
    }
    const billingAgreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
    if (billingAgreement.status !== billingAgreement.status) {
      throw new RestError(Messages.PLEASE_UPDATE_BILLING, 400);
    }
    const response = await this.paypalService.changeSubscriptions(plan.planId, subscription.subscriptionId, userInfo.email);
    if (!response || (response && !response.confirmationLink)) {
      throw new RestError(Messages.CHANGE_SUBSCRIPTION, 400);
    }
    return response.confirmationLink;
  }

  async responseSuccessUseCase(subscriptionId: string) {
    return await this.subscriptionRepository.updateResponseSuccess(subscriptionId);
  }

  async getTransactionsUseCase(paypalSubscriptionId: string, startTime: Date, endTime: Date) {
    return this.paypalService.getTransactions(paypalSubscriptionId, startTime, endTime);
  }

  async getInvoicesUserPaypal(transactionPaypal: any, subscription: Subscription, transactionDB: Transaction) {
    const billingAgreement = await this.paypalService.getBillingAgreement(transactionPaypal.billing_agreement_id);
    const invoiceModel = await this.invoicesRepository.findByPaymentProcessorId(transactionPaypal.id);
    const plan = await this.paypalBillingPlanRepository.finfByPlanId(billingAgreement.plan_id);
    if (!invoiceModel) {
      const userInfor = await this.userRepository.findById(subscription.userId);
      const resultBillingPlans = await this.paypalBillingPlanRepository.finfByPlanId(billingAgreement.plan_id);
      let gst = 0;
      if (transactionPaypal.amount.currency === 'AUD') {
        gst = Math.round((transactionPaypal.amount.details.subtotal / 11) * 100) / 100;
      }
      const invoice: Invoices = {
        shopId: subscription.shopId,
        userId: userInfor.id,
        paidAt: transactionPaypal.create_time,
        amount: transactionPaypal.amount.total - gst || 0,
        currency: transactionPaypal.amount.currency,
        gst: gst,
        renewsDate: billingAgreement.billing_info.next_billing_time || null,
        totalAmount: transactionPaypal.amount.total,
        invoiceFrom: transactionPaypal.create_time,
        invoiceTo: billingAgreement.billing_info.next_billing_time || null,
        planType: resultBillingPlans.tier,
        paymentProcessorId: transactionPaypal.id,
        paymentProcessor: PaymentProcessor.PAYPAL,
        subscriptionId: subscription.subscriptionId,
        invoiceStatus: transactionPaypal.status,
        subscriber: billingAgreement.subscriber
      };
      const invoicesCreated = await this.invoicesRepository.create(invoice, subscription.shops.nameShop, transactionDB);
      let payload: any = { shopId: subscription.shopId, userId: subscription.userId, numberItem: plan.numberItem };
      if (subscription.eventType === EventType.CHANGED) {
        payload = { ...payload, numberProduct: plan.numberProduct };
      }
      await this.updatedNumberResourceShop(payload, transactionDB);
      await this.sendInvoiceToEmail(billingAgreement, transactionPaypal, userInfor, invoicesCreated, subscription.shops.nameShop);
    }
  }

  private async sendInvoiceToEmail(billingAgreement: any, transactionPaypal: any, userInfor: UserAttributes, invoices: Invoices, nameShop: string) {
    const taxRate = invoices.gst > 0 ? '10%' : '0';
    const addressLine1 =
      billingAgreement.subscriber && billingAgreement.subscriber.shipping_address && billingAgreement.subscriber.shipping_address.address
        ? billingAgreement.subscriber.shipping_address.address.address_line_1 + billingAgreement.subscriber.shipping_address.address.admin_area_1
        : '';
    const addressLine2 =
      billingAgreement.subscriber && billingAgreement.subscriber.shipping_address && billingAgreement.subscriber.shipping_address.address
        ? billingAgreement.subscriber.shipping_address.address.admin_area_2 +
          billingAgreement.subscriber.shipping_address.address.postal_code +
          billingAgreement.subscriber.shipping_address.address.country_code
        : '';
    const requestEmail: RequestEmail = {
      nameShop,
      billingName: billingAgreement.subscriber.name.given_name + ' ' + billingAgreement.subscriber.name.surname,
      addressLine1,
      addressLine2,
      invoiceNumber: invoices.id,
      invoiceIsueDate: invoices.invoiceFrom,
      invoiceDueDate: invoices.invoiceTo,
      invoiceStatus: transactionPaypal.state,
      paymentTerms: invoices.paymentProcessor,
      paymentCurrent: invoices.currency,
      plantType: capitalizeFirstLetter(invoices.planType),
      totalAmount: invoices.totalAmount,
      gst: invoices.gst,
      taxRate,
      amountBreakdown: transactionPaypal.amount,
      emailUser: userInfor.email
    };
    await nodeMailerServices.sendInvoices(requestEmail);
  }

  async configUserSubscription(billingAgreement: any, subscription: Subscription, transactionDB: Transaction) {
    const plan = await this.paypalBillingPlanRepository.finfByPlanId(billingAgreement.plan_id);
    if (subscription.status !== billingAgreement.status || subscription.planId !== billingAgreement.plan_id) {
      if (billingAgreement.status === SubscriptionStatus.ACTIVE) {
        const findTrial = billingAgreement.billing_info.cycle_executions.find((item) => item.tenure_type === 'TRIAL');
        const payloadSubs: Subscription = {
          shopId: subscription.shopId,
          userId: subscription.userId,
          lastPaymentsFetch: new Date(),
          paymentProcessor: PaymentProcessor.PAYPAL,
          planId: plan.planId,
          status: SubscriptionStatus.ACTIVE,
          eventType: subscription.planId !== billingAgreement.plan_id ? EventType.CHANGED : EventType.NOMORAL,
          isTrial: findTrial ? true : false
        };
        await this.subscriptionRepository.createOrUpdate(payloadSubs, transactionDB);
        await this.shopRepository.updateStatusShopById(subscription.shopId, true, TypePushlisher.SUBSCRIPTION, transactionDB);
        if (subscription.status === SubscriptionStatus.WAITING_SYNC && findTrial) {
          const payload: any = {
            shopId: subscription.shopId,
            userId: subscription.userId,
            numberProduct: plan.numberProduct,
            numberItem: plan.numberItem,
            status: true
          };
          await this.updatedNumberResourceShop(payload, transactionDB);
        }
      }
    }
    if (
      (subscription.status === SubscriptionStatus.ACTIVE && billingAgreement.status === SubscriptionStatus.CANCELLED) ||
      (subscription.status === SubscriptionStatus.ACTIVE && billingAgreement.status === SubscriptionStatus.SUSPENDED) ||
      (subscription.status === SubscriptionStatus.APPROVAL_PENDING && billingAgreement.status === SubscriptionStatus.CANCELLED) ||
      (subscription.status === SubscriptionStatus.APPROVAL_PENDING && billingAgreement.status === SubscriptionStatus.SUSPENDED) ||
      (subscription.status === SubscriptionStatus.SUSPENDED && billingAgreement.status === SubscriptionStatus.CANCELLED)
    ) {
      const payload: Subscription = {
        shopId: subscription.shopId,
        userId: subscription.userId,
        status: billingAgreement.status,
        isTrial: false
      };
      await this.shopRepository.updateStatusShopById(subscription.shopId, false, TypePushlisher.SUBSCRIPTION, transactionDB);
      await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
      const userInfor = await this.userRepository.findById(subscription.userId);
      if (billingAgreement.status === SubscriptionStatus.CANCELLED) {
        await nodeMailerServices.sendSubscriptionCanceled(userInfor, subscription.shops.nameShop);
      }
      if (billingAgreement.status === SubscriptionStatus.SUSPENDED) {
        await nodeMailerServices.sendSubscriptionSuspended(userInfor, subscription.shops.nameShop);
      }
    }
    return;
  }

  private async updatedNumberResourceShop(payload: ShopInterface, transactionDB: Transaction) {
    await this.shopsResourcesRepository.create(payload, transactionDB);
    await this.shopRepository.updatedNumberProductItem(payload, transactionDB);
  }
}
