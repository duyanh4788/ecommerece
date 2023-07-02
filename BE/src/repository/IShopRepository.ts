import { Transaction } from 'sequelize';
import { ShopInterface } from '../interface/ShopInterface';

export interface IShopRepository {
  registed(reqBody: ShopInterface, userId: string, status: boolean, transactionDB: Transaction): Promise<void>;

  updated(reqBody: ShopInterface, userId: string): Promise<void>;

  deleted(id: string, userId: string): Promise<void>;

  getLists(userId: string, roleId?: string): Promise<ShopInterface[]>;

  getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface>;

  updateStatusShopById(shopId: string, status: boolean): Promise<void>;

  updateStatusShopByUserIdId(userId: string, status: boolean, transactionDB: Transaction): Promise<void>;
}
