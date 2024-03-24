import { Transaction } from 'sequelize';
import { Invoices } from '../../interface/SubscriptionInterface';
import { IInvoicesRepository } from '../../repository/IInvoicesRepository';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { InvoicesModel } from '../model/InvoicesModel';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis, PayloadPushlisher, TypePushlisher } from '../../interface/KeyRedisInterface';
import { handleMesagePublish } from '../../common/messages';

export class InvoicesSequelize implements IInvoicesRepository {
  async findAllInvoices(): Promise<Invoices[]> {
    const invoicesModels = await InvoicesModel.findAll();
    return invoicesModels.map((item) => this.transformModelToEntity(item));
  }

  async findByShopId(shopId: string): Promise<Invoices[]> {
    const hasKey = `${MainkeysRedis.INVOICES_BY_SHOP}${shopId}`;
    let invsRedis = await redisController.getAllHasRedis(hasKey);
    if (!invsRedis) {
      const invoicesModels = await InvoicesModel.findAll({ where: { shopId: deCryptFakeId(shopId) } });
      if (!invoicesModels.length) return [];
      invsRedis = invoicesModels.map(async (item) => {
        const newItem = this.transformModelToEntity(item);
        await redisController.setHasRedis({ hasKey, key: newItem.id, values: item });
        return item;
      });
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
    const hasKey = `${MainkeysRedis.INVOICES_BY_SHOP}${shopId}`;
    const entityInv = this.transformModelToEntity(invoice);
    await redisController.setHasRedis({ hasKey, key: entityInv.id, values: entityInv });

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
