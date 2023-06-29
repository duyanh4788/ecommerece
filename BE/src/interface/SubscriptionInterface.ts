import { UsersResourcesInterface } from './UsersResourcesInterface';

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  DAILY = 'daily'
}

export enum Tier {
  STARTER = 'starter',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export enum SubscriptionStatus {
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  WAITING_SYNC = 'WAITING_SYNC'
}

export interface Subscription {
  userId?: string | number | any;
  subscriptionId?: string;
  lastPaymentsFetch?: Date;
  paymentProcessor?: string;
  planId?: string;
  isTrial?: boolean;
  status?: SubscriptionStatus;
  createdAt?: Date;
  paypalBillingPlans?: PaypalBillingPlans;
  usersResources?: UsersResourcesInterface;
}

export interface PaypalBillingPlans {
  tier?: Tier;
  frequency?: SubscriptionFrequency;
  planId?: string;
  amount?: number;
  numberProduct?: number;
  numberIndex?: number;
  isTrial?: boolean;
  createdAt?: Date;
}

export interface Invoices {
  id?: string | number | any;
  userId?: string | number | any;
  paidAt?: Date;
  amount?: number;
  currency?: string;
  gst?: number;
  renewsDate?: Date;
  totalAmount?: number;
  invoiceFrom?: Date;
  invoiceTo?: Date;
  planType?: string;
  subscriptionId?: string;
  invoiceStatus?: string;
  subscriber?: string;
  paymentProcessorId?: string;
  paymentProcessor?: string;
  createdAt?: Date;
}

export enum PaymentSaleCompleted {
  PAYMENT_SALE_COMPLETED = 'PAYMENT.SALE.COMPLETED'
}

export enum NameEventWebHook {
  BILLING_SUBSCRIPTION_ACTIVATED = 'BILLING.SUBSCRIPTION.ACTIVATED',
  BILLING_SUBSCRIPTION_UPDATED = 'BILLING.SUBSCRIPTION.UPDATED',
  BILLING_SUBSCRIPTION_CANCELLED = 'BILLING.SUBSCRIPTION.CANCELLED',
  BILLING_SUBSCRIPTION_SUSPENDED = 'BILLING.SUBSCRIPTION.SUSPENDED',
  BILLING_SUBSCRIPTION_EXPIRED = 'BILLING.SUBSCRIPTION.EXPIRED'
}

export interface RequestEmail {
  billingName: string;
  addressLine1: string;
  addressLine2: string;
  invoiceNumber: number;
  invoiceIsueDate: Date;
  invoiceDueDate: Date;
  invoiceStatus: string;
  paymentTerms: string;
  paymentCurrent: string;
  plantType: string;
  totalAmount: number;
  gst: number;
  taxRate: string;
  amountBreakdown: any;
  emailUser: string;
}

export const MsgErrSubscription = {
  ALLREADY_ACTIVE: 'User is already ACTIVE!',
  NONE_SUBSCRIPTION: 'you can not subscription!',
  SUBSCRIPTION_SUSPENDED: 'Your payment for at least one previous billing cycle failed, please check your Paypal account!',
  CHANGE_SUBSCRIPTION: 'You can not change subscription, please contact admin!',
  PLAN_DUPLICATE: 'Please chose orther plan!',
  PLEASE_UPDATE_BILLING: 'Please refresh this page to get the latest Subscription!',
  PLEASE_WAITING_SYNC: 'Please waiting system sync with Paypal!'
};
