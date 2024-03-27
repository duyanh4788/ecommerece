import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { ShopInterface } from '../../interface/ShopInterface';
import { IShopRepository } from '../../repository/IShopRepository';
import { ShopsModel } from '../model/ShopsModel';
import { RestError } from '../../services/error/error';
import { UsersModel } from '../model/UsersModel';
import { UserRole } from '../../interface/UserInterface';
import { MainkeysRedis, PayloadPushlisher, TypePushlisher } from '../../interface/KeyRedisInterface';
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
    const shop = await ShopsModel.create({ nameShop, banners, userId: deCryptFakeId(userId) });
    await this.handleSetRedisShop(shop);
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
    await shop.save();
    const keyValue = `${MainkeysRedis.SHOPS_BY_ID}${id}`;
    await redisController.delRedis(keyValue);
    return;
  }

  async updatedSliders(sliders: string[], id: string, userId: string): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(id));
    shop.sliders = sliders;
    await shop.save();
    await this.handleSetRedisShop(shop);
    return;
  }

  async updatedNumberProductItem(payload: ShopInterface, transactionDB: Transaction): Promise<void> {
    const { numberProduct, numberItem, shopId, status } = payload;
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    if (status) {
      shop.status = status;
    }
    shop.numberProduct = numberProduct;
    shop.numberItem = shop.numberItem ? shop.numberItem + numberItem : numberItem;
    await shop.save({ transaction: transactionDB });
    await this.handleSetRedisShop(shop);
    return;
  }

  async updateStatusShopById(shopId: string, status: boolean, reasons: string, transactionDB: Transaction): Promise<void> {
    const shop = await ShopsModel.findByPk(deCryptFakeId(shopId));
    if (!shop) return;
    shop.status = status;
    await shop.save(transactionDB && { transaction: transactionDB });

    const payloadPushlisher: PayloadPushlisher = {
      userId: enCryptFakeId(shop.userId),
      shopId,
      type: reasons,
      status,
      nameShop: shop.nameShop,
      channel: MainkeysRedis.CHANNLE_SHOP
    };
    await redisController.handlePublisherSocket(payloadPushlisher);

    await this.handleSetRedisShop(shop);
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
    const keyValue = `${MainkeysRedis.SHOPS_BY_ID}${id}`;
    await redisController.delRedis(keyValue);
    return;
  }

  async getLists(userId: string, roleId?: string): Promise<ShopInterface[]> {
    const options = { include: this.INCLUDES, where: null };
    if (!roleId || roleId !== UserRole.ADMIN) {
      options.where = { userId: deCryptFakeId(userId) };
    }
    const shops = await ShopsModel.findAll({ ...options, order: [['createdAt', 'DESC']] });
    if (!shops.length) return [];
    return shops.map((item) => this.transformModelToEntity(item));
  }

  async getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface> {
    const keyValue = `${MainkeysRedis.SHOPS_BY_ID}${shopId}`;
    let shopRedis = await redisController.getRedis(keyValue);
    if (!shopRedis) {
      const shop = await ShopsModel.findByPk(deCryptFakeId(shopId), { include: this.INCLUDES });
      if (!shop || (!roleId && shop.userId !== deCryptFakeId(userId)) || (roleId && roleId !== UserRole.ADMIN && shop.userId !== deCryptFakeId(userId))) {
        throw new RestError(Messages.NOT_AVAILABLE, 404);
      }
      const entityShop = this.transformModelToEntity(shop);
      await redisController.setRedis({ keyValue, value: entityShop });
      return entityShop;
    }
    return shopRedis;
  }

  async findShopDisable(userId: string): Promise<boolean> {
    const shops = await ShopsModel.findAll({ where: { userId: deCryptFakeId(userId), status: false } });
    if (shops && shops.length) return true;
    return false;
  }

  private async handleSetRedisShop(shopModel: ShopsModel) {
    const entityShop = this.transformModelToEntity(shopModel);
    const keyValue = `${MainkeysRedis.SHOPS_BY_ID}${entityShop.id}`;
    await redisController.setRedis({ keyValue, value: entityShop });
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ShopsModel): ShopInterface {
    if (!model) return;
    const entity: ShopInterface = model.dataValues;
    entity.id = enCryptFakeId(entity.id);
    entity.userId = enCryptFakeId(entity.userId);
    if (entity.shopProducts && entity.shopProducts.length) {
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
