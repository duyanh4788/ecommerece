import { Transaction } from 'sequelize';
import { Invoices } from '../interface/SubscriptionInterface';

export interface IInvoicesRepository {
  findAllInvoices(): Promise<Invoices[]>;

  findByUserId(userId: string): Promise<Invoices[]>;

  findByPaymentProcessorId(paymentProcessorId: string): Promise<Invoices>;

  create(reqBody: Invoices, transactionDB?: Transaction): Promise<Invoices>;
}
