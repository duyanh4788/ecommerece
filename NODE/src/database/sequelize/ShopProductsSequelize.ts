import { Transaction } from 'sequelize';
import { IShopProductsRepository } from '../../repository/IShopProductsRepository';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { ShopProductsModel } from '../model/ShopProductsModel';

export class ShopProductsSequelize implements IShopProductsRepository {
  constructor() {}

  async updated(shopId: string, productId: string, status: boolean, transactionDB?: Transaction): Promise<void> {
    const [shopProducts, created] = await ShopProductsModel.findOrCreate({
      where: { shopId: deCryptFakeId(shopId), productId: deCryptFakeId(productId) },
      defaults: { status: status }
    });
    if (!created) {
      shopProducts.status = status;
      await shopProducts.save();
    }
    return;
  }

  async deletedMany(shopId: string, transactionDB?: Transaction): Promise<void> {
    await ShopProductsModel.destroy({ where: { shopId: deCryptFakeId(shopId) } });
    return;
  }
}
