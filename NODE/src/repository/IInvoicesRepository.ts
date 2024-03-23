import { Transaction } from 'sequelize';
import { Invoices } from '../interface/SubscriptionInterface';

export interface IInvoicesRepository {
  findAllInvoices(): Promise<Invoices[]>;

  findByShopId(userId: string): Promise<Invoices[]>;

  findByPaymentProcessorId(paymentProcessorId: string): Promise<Invoices>;

  create(reqBody: Invoices, nameShop: string, transactionDB?: Transaction): Promise<Invoices>;
}
