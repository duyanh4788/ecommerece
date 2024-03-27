import { Transaction } from 'sequelize';
import { Invoices } from '../../interface/SubscriptionInterface';
import { IInvoicesRepository } from '../../repository/IInvoicesRepository';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { InvoicesModel } from '../model/InvoicesModel';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis, PayloadPushlisher, TypePushlisher } from '../../interface/KeyRedisInterface';
import { ShopsModel } from '../model/ShopsModel';

export class InvoicesSequelize implements IInvoicesRepository {
  private INCLUDES: any[] = [[{ model: ShopsModel, attributes: ['nameShop'] }]];
  async findAllInvoices(): Promise<Invoices[]> {
    const invoicesModels = await InvoicesModel.findAll({ include: this.INCLUDES });
    return invoicesModels.map((item) => this.transformModelToEntity(item));
  }

  async findByShopId(shopId: string): Promise<Invoices[]> {
    const keyValue = `${MainkeysRedis.INVOICES_BY_SHOP}${shopId}`;
    let invsRedis = await redisController.lrankMembersRedis(keyValue);
    if (!invsRedis.length) {
      const invoicesModels = await InvoicesModel.findAll({ where: { shopId: deCryptFakeId(shopId) }, include: this.INCLUDES });
      if (!invoicesModels.length) return [];
      const entityInvs: Invoices[] = await Promise.all(
        invoicesModels.map(async (item) => {
          const newEntity = this.transformModelToEntity(item);
          await redisController.lpushMembersRedis(keyValue, newEntity);
          return newEntity;
        })
      );
      return entityInvs;
    }
    return invsRedis;
  }

  async findByPaymentProcessorId(paymentProcessorId: string): Promise<Invoices> {
    const invoice = await InvoicesModel.findOne({ where: { paymentProcessorId } });
    return this.transformModelToEntity(invoice);
  }

  async create(reqBody: Invoices, nameShop: string, transactionDB?: Transaction): Promise<Invoices> {
    const { shopId, userId, paidAt, amount, currency, gst, renewsDate, totalAmount, invoiceFrom, invoiceTo, planType, paymentProcessorId, paymentProcessor } = reqBody;
    const invoice = await InvoicesModel.create(
      { shopId: deCryptFakeId(shopId), userId: deCryptFakeId(userId), paidAt, amount, currency, gst, renewsDate, totalAmount, invoiceFrom, invoiceTo, planType, paymentProcessorId, paymentProcessor },
      { transaction: transactionDB }
    );
    const keyValue = `${MainkeysRedis.INVOICES_BY_SHOP}${shopId}`;
    const entityInv = this.transformModelToEntity(invoice);
    await redisController.lpushMembersRedis(keyValue, entityInv);

    const payloadPushlisher: PayloadPushlisher = {
      userId,
      shopId,
      type: TypePushlisher.INVOICES,
      status: true,
      nameShop,
      channel: MainkeysRedis.CHANNLE_SHOP
    };
    await redisController.handlePublisherSocket(payloadPushlisher);

    return entityInv;
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
