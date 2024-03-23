import { IItemsRepository } from '../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface } from '../interface/ItemsInterface';
import { Transaction } from 'sequelize';
import { IShopsResourcesRepository } from '../repository/IShopsResourcesRepository';
import { IntegerValue, TypeDecInc } from '../interface/ShopsResourcesInterface';

export class ItemsUseCase {
  constructor(private itemsRepository: IItemsRepository, private shopsResourcesRepository: IShopsResourcesRepository) {}

  async getListsItemsUseCase(shopId: string, page: number, pageSize: number, search: any, options: string) {
    return await this.itemsRepository.getListsItems(shopId, page, pageSize, search, options);
  }

  async getListsItemsByProdIdUseCase(productId: string, page: number, pageSize: number) {
    return await this.itemsRepository.getListsItemsByProdId(productId, page, pageSize);
  }

  async getItemsByIdUseCase(id: string) {
    return await this.itemsRepository.getItemsById(id);
  }

  async createdItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    await this.shopsResourcesRepository.decretIncre(payload.shopId, TypeDecInc.NUMBER_ITEM, IntegerValue.DECR, 1, transactionDB);
    return await this.itemsRepository.createdItems(payload, payloadEntity, transactionDB);
  }

  async updatedItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    return await this.itemsRepository.updatedItems(payload, payloadEntity, transactionDB);
  }

  async deletedItemsUseCase(id: string, transactionDB?: Transaction) {
    return await this.itemsRepository.deletedItems(id, transactionDB);
  }

  async updatedItemsThumbUseCase(reqBody: any) {
    const { id, itemThumb } = reqBody;
    return await this.itemsRepository.updatedSliders(id, itemThumb);
  }
}
