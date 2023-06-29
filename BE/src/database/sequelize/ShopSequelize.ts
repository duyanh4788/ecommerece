import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { ShopInterface } from '../../interface/ShopInterface';
import { IShopRepository } from '../../repository/IShopRepository';
import { ShopsModel } from '../model/ShopsModel';
import { RestError } from '../../services/error/error';
import { ProductsSequelize } from './ProductsSequelize';
import { UsersModel } from '../model/UsersModel';
import { UserRole } from '../../interface/UserInterface';
import { RedisUsers } from '../../redis/users/RedisUsers';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { Transaction } from 'sequelize';

export class ShopSequelize implements IShopRepository {
  private ATTRIBUTES_USER: string[] = ['fullName', 'email', 'phone', 'avatar'];
  private productModel = new ProductsSequelize();
  constructor() {}
  async registed(reqBody: ShopInterface, userId: string, status: boolean, transactionDB: Transaction): Promise<void> {
    const numbers = await ShopsModel.count({ where: { userId: deCryptFakeId(userId) } });
    if (numbers >= 1) {
      throw new RestError('feature multiple Shop is pending!', 404);
    }
    const { nameShop, prodcutSell, banners } = reqBody;
    const deCryptProduct = prodcutSell.map((item) => deCryptFakeId(item));
    await ShopsModel.create({ nameShop, prodcutSell: deCryptProduct, banners, userId: deCryptFakeId(userId), status }, { transaction: transactionDB });
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    return;
  }
  async updated(reqBody: ShopInterface, userId: string): Promise<void> {
    const { id, nameShop, prodcutSell, banners } = reqBody;
    const find = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!find) throw new RestError('shop not availabe!', 404);
    if (find.userId !== deCryptFakeId(userId)) throw new RestError('shop not availabe!', 404);
    if (nameShop) {
      find.nameShop = nameShop;
    }
    if (prodcutSell) {
      find.prodcutSell = prodcutSell.map((item) => deCryptFakeId(item));
    }
    if (banners) {
      find.banners = banners;
    }
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOP_ID, id);
    await find.save();
    return;
  }

  async deleted(id: string, userId: string): Promise<void> {
    const find = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!find) throw new RestError('shop not availabe!', 404);
    if (find.userId !== deCryptFakeId(userId)) throw new RestError('shop not availabe!', 404);
    await find.destroy();
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOP_ID, id);
    return;
  }

  async getLists(userId: string, roleId?: string): Promise<ShopInterface[]> {
    const options = {
      where:
        !roleId || roleId !== UserRole.ADMIN
          ? {
              userId: deCryptFakeId(userId)
            }
          : null,
      include: {
        model: UsersModel,
        attributes: this.ATTRIBUTES_USER
      }
    };
    const shops = await ShopsModel.findAll(options);
    const listShop = await Promise.all(
      shops.map(async (item) => {
        if (!item.prodcutSell.length) return item;
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
    return listShop.map((item) => this.transformModelToEntity(item));
  }

  async getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId), { include: { model: UsersModel, attributes: this.ATTRIBUTES_USER } });
    if ((!roleId && shop.userId !== deCryptFakeId(userId)) || (roleId && roleId !== UserRole.ADMIN && shop.userId !== deCryptFakeId(userId))) {
      throw new RestError('shop is not available!', 404);
    }
    if ((!shop.status && !roleId) || (!shop.status && roleId && roleId !== UserRole.ADMIN)) throw new RestError('shop is not approved by admin!', 404);
    if (!shop.prodcutSell.length) {
      return this.transformModelToEntity(shop);
    }
    const products = await Promise.all(
      shop.prodcutSell.map(async (item) => {
        const product = await this.productModel.findById(item);
        if (product) return product;
      })
    );
    shop.prodcutSell = products;
    return this.transformModelToEntity(shop);
  }
  async updateStatusShop(shopId: string, status: boolean): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.status = status;
    await shop.save();
    const result = this.transformModelToEntity(shop);
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOPS_USERID, result.userId);
    await RedisUsers.getInstance().handlerDelKeys(MainkeysRedis.SHOP_ID, shopId);
    return;
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
