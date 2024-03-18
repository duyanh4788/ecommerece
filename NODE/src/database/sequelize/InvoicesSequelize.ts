import { Transaction } from 'sequelize';
import { Invoices } from '../../interface/SubscriptionInterface';
import { IInvoicesRepository } from '../../repository/IInvoicesRepository';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { InvoicesModel } from '../model/InvoicesModel';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class InvoicesSequelize implements IInvoicesRepository {
  async findAllInvoices(): Promise<Invoices[]> {
    let invRedis = await redisController.getRedis(MainkeysRedis.ADMIN_INV);
    if (!invRedis) {
      const invoicesModels = await InvoicesModel.findAll();
      if (!invoicesModels.length) return [];
      invRedis = await redisController.setRedis({ keyValue: MainkeysRedis.ADMIN_INV, value: invoicesModels.map((item) => this.transformModelToEntity(item)) });
    }
    return invRedis;
  }

  async findByShopId(shopId: string): Promise<Invoices[]> {
    const key = `${MainkeysRedis.INVS_ID}${shopId}`;
    let invsRedis = await redisController.getRedis(key);
    if (!invsRedis) {
      const invoicesModels = await InvoicesModel.findAll({ where: { shopId: deCryptFakeId(shopId) } });
      if (!invoicesModels.length) return [];
      invsRedis = await redisController.setRedis({ keyValue: key, value: invoicesModels.map((item) => this.transformModelToEntity(item)) });
    }
    return invsRedis;
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
