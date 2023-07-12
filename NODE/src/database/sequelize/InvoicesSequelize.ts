import { Transaction } from 'sequelize';
import { Invoices } from '../../interface/SubscriptionInterface';
import { IInvoicesRepository } from '../../repository/IInvoicesRepository';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { InvoicesModel } from '../model/InvoicesModel';

export class InvoicesSequelize implements IInvoicesRepository {
  async findAllInvoices(): Promise<Invoices[]> {
    const invoices = await InvoicesModel.findAll();
    return invoices.map((item) => this.transformModelToEntity(item));
  }

  async findByShopId(shopId: string): Promise<Invoices[]> {
    const invoices = await InvoicesModel.findAll({ where: { shopId: deCryptFakeId(shopId) } });
    return invoices.map((item) => this.transformModelToEntity(item));
  }

  async findByPaymentProcessorId(paymentProcessorId: string): Promise<Invoices> {
    const invoice = await InvoicesModel.findOne({ where: { paymentProcessorId } });
    return this.transformModelToEntity(invoice);
  }

  async create(reqBody: Invoices, transactionDB?: Transaction): Promise<Invoices> {
    const { shopId, userId, paidAt, amount, currency, gst, renewsDate, totalAmount, invoiceFrom, invoiceTo, planType, paymentProcessorId, paymentProcessor } = reqBody;
    const invoice = await InvoicesModel.create(
      { shopId: deCryptFakeId(shopId), userId: deCryptFakeId(userId), paidAt, amount, currency, gst, renewsDate, totalAmount, invoiceFrom, invoiceTo, planType, paymentProcessorId, paymentProcessor },
      { transaction: transactionDB }
    );
    return this.transformModelToEntity(invoice);
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: InvoicesModel): Invoices {
    if (!model) return;
    const entity: any = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.shopId = enCryptFakeId(entity.shopId);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
