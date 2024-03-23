import { Transaction } from 'sequelize';
import { ShopInterface } from '../interface/ShopInterface';

export interface IShopRepository {
  registed(reqBody: ShopInterface, userId: string): Promise<void>;

  updated(reqBody: ShopInterface, userId: string): Promise<void>;

  updatedSliders(sliders: string[], id: string, userId: string): Promise<void>;

  updatedNumberProductItem(payload: ShopInterface, transactionDB: Transaction): Promise<void>;

  deleted(id: string, userId: string): Promise<void>;

  getLists(userId: string, roleId?: string): Promise<ShopInterface[]>;

  getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface>;

  findShopDisable(userId: string): Promise<boolean>;

  updateStatusShopById(shopId: string, status: boolean, reasons: string, transactionDB?: Transaction): Promise<void>;
}
