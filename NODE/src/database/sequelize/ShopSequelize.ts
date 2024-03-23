import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { Reasons, ShopInterface } from '../../interface/ShopInterface';
import { IShopRepository } from '../../repository/IShopRepository';
import { ShopsModel } from '../model/ShopsModel';
import { RestError } from '../../services/error/error';
import { UsersModel } from '../model/UsersModel';
import { UserRole } from '../../interface/UserInterface';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { Transaction } from 'sequelize';
import { SubscriptionModel } from '../model/SubscriptionModel';
import { removeFile } from '../../utils/removeFile';
import { redisController } from '../../redis/RedisController';
import { ShopProductsModel } from '../model/ShopProductsModel';
import { ProductsModel } from '../model/ProductsModel';
import { Messages, handleMesagePublish, handleMsgWithItemResource } from '../../common/messages';

export class ShopSequelize implements IShopRepository {
  private INCLUDES: any[] = [
    { model: UsersModel, attributes: ['fullName', 'email', 'phone', 'avatar'] },
    { model: SubscriptionModel, attributes: ['status'] },
    {
      model: ShopProductsModel,
      required: false,
      where: { status: true },
      include: [{ model: ProductsModel, where: { status: true }, attributes: ['nameProduct', 'avatar', 'status', 'id'] }]
    }
  ];
  constructor() {}

  async registed(reqBody: ShopInterface, userId: string): Promise<void> {
    const { nameShop, banners } = reqBody;
    await ShopsModel.create({ nameShop, banners, userId: deCryptFakeId(userId) });
    await this.handleDelRedis(userId);
    return;
  }

  async updated(reqBody: ShopInterface, userId: string): Promise<void> {
    const { id, nameShop, productIds, banners, sliders } = reqBody;
    const shop = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!shop) throw new RestError(Messages.NOT_AVAILABLE, 404);
    if (!shop.status) throw new RestError(Messages.SHOP_NONE_SUBS, 404);
    if (shop.userId !== deCryptFakeId(userId)) throw new RestError(Messages.NOT_AVAILABLE, 404);
    if (nameShop) {
      shop.nameShop = nameShop;
    }
    if (productIds || productIds.length) {
      const numberPros = productIds.filter((item) => item.status);
      if (numberPros.length > shop.numberProduct) {
        throw new RestError(handleMsgWithItemResource(shop.numberProduct));
      }
    }
    if (banners) {
      shop.banners = banners;
    }
    if (sliders && sliders.length) {
      shop.sliders = sliders;
    }
    await this.handleDelRedis(userId, id);
    await shop.save();
    return;
  }

  async updatedSliders(sliders: string[], id: string, userId: string): Promise<void> {
    await ShopsModel.update({ sliders }, { where: { id: deCryptFakeId(id) } });
    await this.handleDelRedis(userId, id);
    return;
  }

  async updatedNumberResourceSubs(payload: ShopInterface, transactionDB: Transaction): Promise<void> {
    const { numberProduct, numberItem, shopId, userId } = payload;
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.numberProduct = numberProduct;
    shop.numberItem = shop.numberItem ? shop.numberItem + numberItem : numberItem;
    await shop.save({ transaction: transactionDB });
    await this.handleDelRedis(userId, enCryptFakeId(shop.id));
    await redisController.publisher(MainkeysRedis.SHOP_ID, {
      userId: enCryptFakeId(shop.userId),
      shopId: enCryptFakeId(shop.id),
      messages: handleMesagePublish(true, Reasons.INVOICES, shop.nameShop)
    });
    return;
  }

  async deleted(id: string, userId: string): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(id));
    if (!shop) throw new RestError(Messages.NOT_AVAILABLE, 404);
    if (shop.userId !== deCryptFakeId(userId)) throw new RestError(Messages.NOT_AVAILABLE, 404);
    if (shop.sliders && shop.sliders.length) {
      shop.sliders.forEach((item) => removeFile(item));
    }
    if (shop.banners && shop.banners.length) {
      shop.banners.forEach((item) => removeFile(item));
    }
    await shop.destroy();
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
      if (!shops.length) return [];
      shopsRedis = await redisController.setRedis({ keyValue: key, value: shops.map((item) => this.transformModelToEntity(item)) });
    }
    return shopsRedis;
  }

  async getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface> {
    const key = `${MainkeysRedis.SHOP_ID}${shopId}`;
    let shopRedis = await redisController.getRedis(key);
    if (!shopRedis) {
      const shop = await ShopsModel.findByPk(deCryptFakeId(shopId), { include: this.INCLUDES });
      if (!shop || (!roleId && shop.userId !== deCryptFakeId(userId)) || (roleId && roleId !== UserRole.ADMIN && shop.userId !== deCryptFakeId(userId))) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      if (!shop.shopProducts || !shop.shopProducts.length) {
        shopRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shop) });
        return shopRedis;
      }
      shopRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shop) });
    }
    return shopRedis;
  }

  async findShopDisable(userId: string): Promise<boolean> {
    const shops = await ShopsModel.findAll({ where: { userId: deCryptFakeId(userId), status: false } });
    if (shops && shops.length) return true;
    return false;
  }

  async updateStatusShopById(shopId: string, status: boolean, reasons: string, transactionDB: Transaction): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.status = status;
    await shop.save(transactionDB && { transaction: transactionDB });
    const result = this.transformModelToEntity(shop);
    await this.handleDelRedis(result.userId, shopId);
    await redisController.publisher(MainkeysRedis.SHOP_ID, {
      userId: enCryptFakeId(shop.userId),
      shopId: enCryptFakeId(shop.id),
      messages: handleMesagePublish(status, reasons, shop.nameShop)
    });
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
    if (entity.shopProducts.length) {
      entity.products = [];
      entity.shopProducts.forEach((item: any) => {
        entity.products.push({ ...item.products.dataValues, id: enCryptFakeId(item.products.dataValues.id) });
      });
      delete entity.productIds;
      delete entity.shopProducts;
    }
    return entity;
  }
}
