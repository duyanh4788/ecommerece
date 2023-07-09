import { IItemsRepository } from '../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface } from '../interface/ItemsInterface';
import { Transaction } from 'sequelize';
import { IShopsResourcesRepository } from '../repository/IShopsResourcesRepository';
import { IntegerValue, TypeDecInc } from '../interface/ShopsResourcesInterface';

export class ItemsUseCase {
  constructor(private itemsRepository: IItemsRepository, private shopsResourcesRepository: IShopsResourcesRepository) {}

  async getListsItemsUseCase(shopId: string, page: number, pageSize: number, options: string) {
    return await this.itemsRepository.getListsItems(shopId, page, pageSize, options);
  }

  async getItemsByIdUseCase(id: string) {
    return await this.itemsRepository.getItemsById(id);
  }

  async createdItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    await this.shopsResourcesRepository.decretIncre(payload.shopId, TypeDecInc.NUMBER_ITEM, IntegerValue.DECR, 1, payload.subscriptionId, transactionDB);
    return await this.itemsRepository.createdItems(payload, payloadEntity, transactionDB);
  }

  async updatedItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    return await this.itemsRepository.updatedItems(payload, payloadEntity, transactionDB);
  }

  async deletedItemsUseCase(id: string, transactionDB?: Transaction) {
    return await this.itemsRepository.deletedItems(id, transactionDB);
  }
}
