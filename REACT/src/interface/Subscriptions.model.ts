export interface Subscription {
  shopId?: string | number | any;
  userId?: string | number | any;
  subscriptionId?: string;
  lastPaymentsFetch?: Date;
  paymentProcessor?: string;
  planId?: string;
  isTrial?: boolean;
  status?: string;
  createdAt?: Date;
  reason?: string;
  paypalBillingPlans?: PaypalBillingPlans;
  shopsResources: ShopsResources;
}

export interface PaypalBillingPlans {
  tier?: string;
  shopId?: string;
  frequency?: string;
  planId?: string;
  amount?: number;
  numberProduct?: number;
  numberItem?: number;
  isTrial?: boolean;
  createdAt?: Date;
}

export interface ShopsResources {
  numberProduct?: number;
  numberItem?: number;
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

export enum SubscriptionStatus {
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  WAITING_SYNC = 'WAITING_SYNC',
}

export enum TypeSubscriber {
  SUBSCRIBER = 'SUBSCRIBER',
  CHANGED = 'CHANGED',
}
