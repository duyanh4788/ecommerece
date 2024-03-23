import { Transaction } from 'sequelize';
import { ShopsResourcesInterface } from '../interface/ShopsResourcesInterface';

export interface IShopsResourcesRepository {
  findByShopId(userId: string): Promise<ShopsResourcesInterface>;

  findById(id: string): Promise<ShopsResourcesInterface>;

  create(reqBody: ShopsResourcesInterface, transactionDb?: Transaction): Promise<ShopsResourcesInterface>;

  decretIncre(shopId: string, value: any, type: string, num: number, transactionDb?: Transaction): Promise<void>;
}
