import { Transaction } from 'sequelize';

export interface IShopProductsRepository {
  updated(shopId: string, productId: string, status: boolean, transactionDB?: Transaction): Promise<void>;

  deletedMany(shopId: string, transactionDB?: Transaction): Promise<void>;
}
