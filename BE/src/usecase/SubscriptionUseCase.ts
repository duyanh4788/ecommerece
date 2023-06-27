import { Transaction } from 'sequelize';
import { PaypalService } from '../services/paypal/PaypalService';
import { ISubscriptionRepository } from '../repository/ISubscriptionRepository';
import { IPaypalBillingPlanRepository } from '../repository/IPaypalBillingPlanRepository';
import { IInvoicesRepository } from '../repository/IInvoicesRepository';
import { Invoices, MsgErrSubscription, PaypalBillingPlans, RequestEmail, Subscription, SubscriptionStatus } from '../interface/SubscriptionInterface';
import { UserAttributes } from '../interface/UserInterface';
import { RestError } from '../services/error/error';
import { IUserRepository } from '../repository/IUserRepository';
import { nodeMailerServices } from '../services/nodemailer/MailServices';
import { RedisPlans } from '../redis/Plans/RedisPlans';
import { capitalizeFirstLetter } from '../utils/accents';

export class SubscriptionUseCase {
  private redisPlans: RedisPlans = new RedisPlans();
  constructor(
    private paypalService: PaypalService,
    private userRepository: IUserRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private paypalBillingPlanRepository: IPaypalBillingPlanRepository,
    private invoicesRepository: IInvoicesRepository
  ) {}

  async adminFindAllSubscriptionUseCase() {
    return this.subscriptionRepository.findAll();
  }

  async adminFindAllInvoicesUseCase() {
    return this.invoicesRepository.findAllInvoices();
  }

  async findAllPlanUseCase() {
    return await this.redisPlans.handlerGetPlans();
  }

  async finfByPlanIdUseCase(planId: string) {
    return this.redisPlans.handlerGetPlanId(planId);
  }

  async userGetSubscriptionUseCase(userId: string) {
    return this.subscriptionRepository.findByUserId(userId);
  }

  async userGetInvoicesUseCase(userId: string) {
    return this.invoicesRepository.findByUserId(userId);
  }

  async getSubscriptionBySubsIdUseCase(subscriptionId: string) {
    return this.subscriptionRepository.findBySubscriptionId(subscriptionId);
  }

  async createdInvoicesdUseCase(reqBody: Invoices, transactionDB?: Transaction) {
    return this.invoicesRepository.create(reqBody, transactionDB);
  }

  async subscriberUseCase(tier: string, userId: string, transactionDB: Transaction) {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    const user = await this.userRepository.findById(userId);
    if (subscription && subscription.status === SubscriptionStatus.ACTIVE) {
      throw new RestError(MsgErrSubscription.ALLREADY_ACTIVE, 404);
    }
    if (subscription && subscription.status === SubscriptionStatus.SUSPENDED) {
      throw new RestError(MsgErrSubscription.SUBSCRIPTION_SUSPENDED, 404);
    }
    const checkTier = (subscription && !subscription.isTrial) || (subscription && subscription.status === SubscriptionStatus.CANCELLED) ? `${tier}_no_trial` : tier;
    const plan: PaypalBillingPlans = await this.redisPlans.handlerGetTier(checkTier);
    try {
      if (subscription && subscription.status === SubscriptionStatus.APPROVAL_PENDING && subscription.planId === plan.planId) {
        const agreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
        return agreement.links.find((link) => link.rel === 'approve').href;
      }
      if (subscription && subscription.status === SubscriptionStatus.APPROVAL_PENDING && subscription.planId !== plan.planId) {
        const payload: Subscription = {
          userId: user.id,
          planId: plan.planId
        };
        const agreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
        await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
        return agreement.links.find((link) => link.rel === 'approve').href;
      }
      if (!subscription || (subscription && subscription.status === SubscriptionStatus.CANCELLED)) {
        return this.createSubscription(user, plan.planId, subscription, transactionDB);
      }
    } catch (error) {
      return this.createSubscription(user, plan.planId, subscription, transactionDB);
    }
  }

  private async createSubscription(userInfo: UserAttributes, planId: string, subscription: Subscription, transactionDB: Transaction) {
    const response = await this.paypalService.subscribeToBillingPlan(planId, userInfo.email);
    const { subscriptionId, confirmationLink } = response;
    const isTrial = subscription && subscription.status === SubscriptionStatus.CANCELLED ? false : true;
    const payload: Subscription = {
      userId: userInfo.id,
      subscriptionId,
      lastPaymentsFetch: new Date(),
      paymentProcessor: 'PAYPAL',
      planId: planId,
      isTrial,
      status: SubscriptionStatus.APPROVAL_PENDING
    };
    await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
    return confirmationLink;
  }

  async cancelUseCase(subscriptionId: string, reason: string, userId: string) {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    if (!subscription || subscription.status !== 'ACTIVE') {
      throw new RestError('No active subscription to cancel', 400);
    }
    if (subscription.subscriptionId !== subscriptionId) {
      throw new RestError('subscription not available', 400);
    }
    await this.paypalService.cancelSubscription(subscriptionId, reason);
    return;
  }

  async changeUseCase(tier: string, userId: string) {
    const userInfo = await this.userRepository.findById(userId);
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    if (!subscription || (subscription && subscription.status !== SubscriptionStatus.ACTIVE)) {
      throw new RestError(MsgErrSubscription.CHANGE_SUBSCRIPTION, 404);
    }
    const checkTier = subscription.status === SubscriptionStatus.ACTIVE || !subscription.isTrial ? `${tier}_no_trial` : tier;
    const plan: PaypalBillingPlans = await this.redisPlans.handlerGetTier(checkTier);
    if (subscription.planId === plan.planId) {
      throw new RestError(MsgErrSubscription.PLAN_DUPLICATE, 404);
    }
    const billingAgreement = await this.paypalService.getBillingAgreement(subscription.subscriptionId);
    if (billingAgreement.status !== billingAgreement.status) {
      throw new RestError(MsgErrSubscription.PLEASE_UPDATE_BILLING, 400);
    }
    const response = await this.paypalService.changeSubscriptions(plan.planId, subscription.subscriptionId, userInfo.email);
    if (!response || (response && !response.confirmationLink)) {
      throw new RestError(MsgErrSubscription.CHANGE_SUBSCRIPTION, 400);
    }
    return response.confirmationLink;
  }

  async getTransactionsUseCase(paypalSubscriptionId: string, startTime: Date, endTime: Date) {
    return this.paypalService.getTransactions(paypalSubscriptionId, startTime, endTime);
  }

  async getInvoicesUserPaypal(transactionPaypal: any, subsciption: Subscription, transaction: Transaction) {
    const billingAgreement = await this.paypalService.getBillingAgreement(transactionPaypal.billing_agreement_id);
    const invoiceModel = await this.invoicesRepository.findByPaymentProcessorId(transactionPaypal.id);
    if (!invoiceModel) {
      const userInfor = await this.userRepository.findById(subsciption.userId);
      const resultBillingPlans = await this.redisPlans.handlerGetPlanId(billingAgreement.plan_id);
      let gst = 0;
      if (transactionPaypal.amount.currency === 'AUD') {
        gst = Math.round((transactionPaypal.amount.details.subtotal / 11) * 100) / 100;
      }
      const invoice: Invoices = {
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
        paymentProcessor: 'PAYPAL',
        subscriptionId: subsciption.subscriptionId,
        invoiceStatus: transactionPaypal.status,
        subscriber: billingAgreement.subscriber
      };
      const invoicesCreated = await this.invoicesRepository.create(invoice, transaction);
      await this.createInvoiceToSendEmail(billingAgreement, transactionPaypal, userInfor, invoicesCreated);
    }
  }

  private async createInvoiceToSendEmail(billingAgreement: any, transactionPaypal: any, userInfor: UserAttributes, invoices: Invoices) {
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
    const plan = await this.redisPlans.handlerGetPlanId(billingAgreement.plan_id);
    if (subscription.status !== billingAgreement.status || subscription.planId !== billingAgreement.plan_id) {
      if (billingAgreement.status === SubscriptionStatus.ACTIVE) {
        const payload: Subscription = {
          userId: subscription.userId,
          lastPaymentsFetch: new Date(),
          paymentProcessor: 'PAYPAL',
          planId: plan.planId,
          status: SubscriptionStatus.ACTIVE
        };
        await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
      }
    }
    if (billingAgreement.billing_info && billingAgreement.billing_info.cycle_executions && billingAgreement.billing_info.cycle_executions.length > 0 && subscription.isTrial) {
      const find = billingAgreement.billing_info.cycle_executions.find((item) => item.tenure_type === 'TRIAL');
      if (!find) {
        const payload: Subscription = {
          userId: subscription.userId,
          isTrial: false
        };
        await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
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
        userId: subscription.userId,
        status: billingAgreement.status,
        isTrial: false
      };
      await this.subscriptionRepository.createOrUpdate(payload, transactionDB);
      const userInfor = await this.userRepository.findById(subscription.userId);
      if (billingAgreement.status === SubscriptionStatus.CANCELLED) {
        await nodeMailerServices.sendSubscriptionCanceled(userInfor);
      }
      if (billingAgreement.status === SubscriptionStatus.SUSPENDED) {
        await nodeMailerServices.sendSubscriptionSuspended(userInfor);
      }
    }
    return;
  }
}
