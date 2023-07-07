import { IItemsRepository } from '../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface } from '../interface/ItemsInterface';
import { Transaction } from 'sequelize';
import { IShopsResourcesRepository } from '../repository/IShopsResourcesRepository';
import { IntegerValue, TypeDecInc } from '../interface/ShopsResourcesInterface';
import { RedisSubscription } from '../redis/subscription/RedisSubscription';
import { RestError } from '../services/error/error';
import { SubscriptionStatus } from '../interface/SubscriptionInterface';
import { RedisResource } from '../redis/subscription/RedisResource';

export class ItemsUseCase {
  constructor(private itemsRepository: IItemsRepository, private shopsResourcesRepository: IShopsResourcesRepository) {}

  async getListsItemsUseCase(shopId: string, page: number, pageSize: number, options: string) {
    return await this.itemsRepository.getListsItems(shopId, page, pageSize, options);
  }

  async getItemsByIdUseCase(id: string) {
    return await this.itemsRepository.getItemsById(id);
  }

  async createdItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    const subs = await this.validateSubscriptionByShopId(payload.shopId, true);
    await this.shopsResourcesRepository.decretIncre(payload.shopId, TypeDecInc.NUMBER_ITEM, IntegerValue.DECR, 1, subs.subscriptionId, transactionDB);
    return await this.itemsRepository.createdItems(payload, payloadEntity, transactionDB);
  }

  async updatedItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    await this.validateSubscriptionByShopId(payload.shopId, false);
    return await this.itemsRepository.updatedItems(payload, payloadEntity, transactionDB);
  }

  async deletedItemsUseCase(id: string, transactionDB?: Transaction) {
    return await this.itemsRepository.deletedItems(id, transactionDB);
  }

  async validateSubscriptionByShopId(shopId: string, isCheck: boolean) {
    const subs = await RedisSubscription.getInstance().getSubsByShopId(shopId);
    if (!subs || subs.status !== SubscriptionStatus.ACTIVE) {
      throw new RestError('shop is not subscription', 404);
    }
    if (isCheck) {
      const shopResource = await RedisResource.getInstance().findByShopId(shopId);
      if (!shopResource) {
        throw new RestError('shop is not subscription', 404);
      }
      if (shopResource.numberItem <= 0) {
        throw new RestError('Item is zero, please upgrade subscription or waiting next payment!', 404);
      }
    }

    return subs;
  }
}
