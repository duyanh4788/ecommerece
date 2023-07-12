import { Transaction } from 'sequelize';
import { ShopsResourcesInterface } from '../interface/ShopsResourcesInterface';

export interface IShopsResourcesRepository {
  findByShopId(userId: string): Promise<ShopsResourcesInterface>;

  findById(id: string): Promise<ShopsResourcesInterface>;

  create(reqBody: ShopsResourcesInterface, subscriptionId: string, transactionDb?: Transaction): Promise<ShopsResourcesInterface>;

  decretIncre(shopId: string, value: any, type: string, num: number, subscriptionId: string, transactionDb?: Transaction): Promise<void>;
}
