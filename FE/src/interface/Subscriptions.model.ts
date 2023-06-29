export interface Subscription {
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
}

export interface PaypalBillingPlans {
  tier?: string;
  frequency?: string;
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

export enum SubscriptionStatus {
  APPROVAL_PENDING = 'APPROVAL_PENDING',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}

export enum TypeSubscriber {
  SUBSCRIBER = 'SUBSCRIBER',
  CHANGED = 'CHANGED',
}
