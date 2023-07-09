import { Transaction } from 'sequelize';
import { PayloadEntity, ItemsInterface, ListItemsInterface } from '../interface/ItemsInterface';

export interface IItemsRepository {
  /**
   * get items by shop id
   * @param shopId
   */
  getListsItems(shopId: string, page: number, pageSize: number, search: any, options: string): Promise<ListItemsInterface>;

  /**
   * get items by id
   * @param id
   */
  getItemsById(id: string): Promise<ItemsInterface>;

  /**
   * @param payload
   * @param transactionDB
   */
  createdItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<ItemsInterface>;

  /**
   * @param payload
   * @param transactionDB
   */
  updatedItems(payload: ItemsInterface, payloadEntity: PayloadEntity, transactionDB?: Transaction): Promise<ItemsInterface>;

  /**
   * @param id
   * @param transactionDB
   */
  deletedItems(id: string, transactionDB?: Transaction): Promise<void>;

  /**
   * @param itemThumb
   * @param id
   * @param userId
   */
  updatedSliders(id: string, itemThumb: string[]): Promise<void>;
}
