import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { ShopInterface } from '../../interface/ShopInterface';
import { IShopRepository } from '../../repository/IShopRepository';
import { ShopsModel } from '../model/ShopsModel';
import { RestError } from '../../services/error/error';
import { ProductsSequelize } from './ProductsSequelize';
import { UsersModel } from '../model/UsersModel';
import { UserRole } from '../../interface/UserInterface';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { Transaction } from 'sequelize';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { removeFile } from '../../utils/removeFile';
import { redisController } from '../../redis/RedisController';

export class ShopSequelize implements IShopRepository {
  private INCLUDES: any[] = [
    { model: UsersModel, attributes: ['fullName', 'email', 'phone', 'avatar'] },
    { model: SubscriptionModel, attributes: ['status'] }
  ];
  private productModel = new ProductsSequelize();

  constructor() {}

  async registed(reqBody: ShopInterface, userId: string): Promise<void> {
    const { nameShop, banners } = reqBody;
    await ShopsModel.create({ nameShop, banners, userId: deCryptFakeId(userId) });
    await this.handleDelRedis(userId);
    return;
  }

  async updated(reqBody: ShopInterface, userId: string): Promise<void> {
    const { id, nameShop, prodcutSell, banners, sliders } = reqBody;
    const find = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!find) throw new RestError('shop not availabe!', 404);
    if (!find.status) throw new RestError('shop is not active subscription!', 404);
    if (find.userId !== deCryptFakeId(userId)) throw new RestError('shop not availabe!', 404);
    if (nameShop) {
      find.nameShop = nameShop;
    }
    if (prodcutSell) {
      if (prodcutSell.length > find.numberProduct) {
        throw new RestError(`You can only update product with ${find.numberProduct} number`, 404);
      }
      find.prodcutSell = prodcutSell.map((item) => deCryptFakeId(item));
    }
    if (banners) {
      find.banners = banners;
    }
    if (sliders && sliders.length) {
      find.sliders = sliders;
    }
    await this.handleDelRedis(userId, id);
    await find.save();
    return;
  }

  async updatedSliders(sliders: string[], id: string, userId: string): Promise<void> {
    await ShopsModel.update({ sliders }, { where: { id: deCryptFakeId(id) } });
    await this.handleDelRedis(userId, id);
    return;
  }

  async updatedNumberResource(payload: ShopInterface, transactionDB: Transaction): Promise<void> {
    const { numberProduct, numberItem, shopId, userId } = payload;
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.numberProduct = numberProduct;
    shop.numberItem = shop.numberItem ? shop.numberItem + numberItem : numberItem;
    await shop.save({ transaction: transactionDB });
    await this.handleDelRedis(userId, enCryptFakeId(shop.id));
    return;
  }

  async deleted(id: string, userId: string): Promise<void> {
    const find = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!find) throw new RestError('shop not availabe!', 404);
    if (find.userId !== deCryptFakeId(userId)) throw new RestError('shop not availabe!', 404);
    if (find.sliders && find.sliders.length) {
      find.sliders.forEach((item) => removeFile(item));
    }
    if (find.banners && find.banners.length) {
      find.banners.forEach((item) => removeFile(item));
    }
    await find.destroy();
    await this.handleDelRedis(userId, id);
    return;
  }

  async getLists(userId: string, roleId?: string): Promise<ShopInterface[]> {
    const key = `${MainkeysRedis.SHOPS_USERID}${userId}`;
    let shopsRedis = await redisController.getRedis(key);
    if (!shopsRedis) {
      const options = {
        where:
          !roleId || roleId !== UserRole.ADMIN
            ? {
                userId: deCryptFakeId(userId)
              }
            : null,
        include: this.INCLUDES
      };
      const shops = await ShopsModel.findAll(options);
      const listShop = await Promise.all(
        shops.map(async (item) => {
          if (!item.prodcutSell || !item.prodcutSell.length) return item;
          item.prodcutSell = await Promise.all(
            item.prodcutSell.map(async (itemProd) => {
              const product = await this.productModel.findById(itemProd);
              if (product) itemProd = product;
              return itemProd;
            })
          );
          return item;
        })
      );
      if (!shops) return [];
      shopsRedis = await redisController.setRedis({ keyValue: key, value: listShop.map((item) => this.transformModelToEntity(item)) });
    }
    return shopsRedis;
  }

  async getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface> {
    const key = `${MainkeysRedis.SHOP_ID}${shopId}`;
    let shopRedis = await redisController.getRedis(key);
    if (!shopRedis) {
      const decrShopId = deCryptFakeId(shopId);
      const shop = await ShopsModel.findByPk(decrShopId, { include: this.INCLUDES });
      if (!shop || (!roleId && shop.userId !== deCryptFakeId(userId)) || (roleId && roleId !== UserRole.ADMIN && shop.userId !== deCryptFakeId(userId))) {
        throw new RestError('shop is not available!', 404);
      }
      if (!shop.prodcutSell || !shop.prodcutSell.length) {
        shopRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shop) });
        return shopRedis;
      }
      const products = await Promise.all(
        shop.prodcutSell.map(async (item) => {
          const product = await this.productModel.findById(item);
          if (product) return product;
        })
      );
      shop.prodcutSell = products;
      shopRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shop) });
    }
    return shopRedis;
  }

  async findShopDisable(userId: string): Promise<boolean> {
    const find = await ShopsModel.findAll({ where: { userId: deCryptFakeId(userId), status: false } });
    if (find && find.length) return true;
    return false;
  }

  async updateStatusShopById(shopId: string, status: boolean, transactionDB: Transaction): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.status = status;
    await shop.save(transactionDB && { transaction: transactionDB });
    const result = this.transformModelToEntity(shop);
    await this.handleDelRedis(result.userId, shopId);
    return;
  }
  private async handleDelRedis(userId: string, shopId: string = null) {
    await redisController.delRedis(`${MainkeysRedis.SHOPS_USERID}${userId}`);
    if (shopId) {
      await redisController.delRedis(`${MainkeysRedis.SHOP_ID}${shopId}`);
    }
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ShopsModel): ShopInterface {
    if (!model) return;
    const entity: ShopInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
