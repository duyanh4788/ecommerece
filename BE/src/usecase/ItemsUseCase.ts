import { IItemsRepository } from '../repository/IItemsRepository';
import { PayloadEntity, ItemsInterface } from '../interface/ItemsInterface';
import { Transaction } from 'sequelize';

export class ItemsUseCase {
  constructor(private itemsRepository: IItemsRepository) {}

  async getListsItemsUseCase(shopId: string) {
    return await this.itemsRepository.getListsItems(shopId);
  }

  async getItemsByIdUseCase(id: string) {
    return await this.itemsRepository.getItemsById(id);
  }

  async createdItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    return await this.itemsRepository.createdItems(payload, payloadEntity, transactionDB);
  }

  async updatedItemsUseCase(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction) {
    return await this.itemsRepository.updatedItems(payload, payloadEntity, transactionDB);
  }

  async deletedItemsUseCase(id: string, transactionDB?: Transaction) {
    return await this.itemsRepository.deletedItems(id, transactionDB);
  }
}
