import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { RestError } from '../../services/error/error';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { IShopsResourcesRepository } from '../../repository/IShopsResourcesRepository';
import { IntegerValue, ShopsResourcesInterface } from '../../interface/ShopsResourcesInterface';
import { ShopsResourcesModel } from '../model/ShopsResourcesModel';

export class ShopsResourcesSequelize implements IShopsResourcesRepository {
  async findByShopId(shopId: string): Promise<ShopsResourcesInterface> {
    const resource = await ShopsResourcesModel.findOne({ where: { shopId: deCryptFakeId(shopId) } });
    return this.transformModelToEntity(resource);
  }

  async findById(id: string): Promise<ShopsResourcesInterface> {
    const resource = await ShopsResourcesModel.findByPk(deCryptFakeId(id));
    return this.transformModelToEntity(resource);
  }

  async create(reqBody: ShopsResourcesInterface, subscriptionId: string, transactionDB?: Transaction): Promise<ShopsResourcesInterface> {
    const { shopId, numberProduct, numberItem } = reqBody;
    const [resource, created] = await ShopsResourcesModel.findOrCreate({
      where: { shopId: deCryptFakeId(shopId) },
      defaults: { numberProduct, numberItem },
      transaction: transactionDB
    });
    if (!created) {
      resource.shopId = deCryptFakeId(shopId);
      resource.numberItem = resource.numberItem ? resource.numberItem + numberItem : numberItem;
      if (numberProduct) {
        resource.numberProduct = numberProduct;
      }
      await resource.save({ transaction: transactionDB });
    }
    await this.handleRedis(shopId, subscriptionId);
    return this.transformModelToEntity(resource);
  }

  async decretIncre(shopId: string, value: any, type: string, num: number, subscriptionId: string, transactionDb?: Transaction): Promise<void> {
    const resource = await ShopsResourcesModel.findOne({ where: { shopId: deCryptFakeId(shopId) } });
    if (!resource) throw new RestError('resource not available', 404);
    if (type === IntegerValue.DECR) {
      await resource.decrement(value, { by: num, transaction: transactionDb });
    }
    if (type === IntegerValue.INCR) {
      await resource.increment(value, { by: num, transaction: transactionDb });
    }
    await this.handleRedis(shopId, subscriptionId);
    return;
  }

  private async handleRedis(shopId: string, subscriptionId: string) {
    await RedisSubscription.getInstance().handlerDelKeys(MainkeysRedis.SUBS_SHOPID, shopId);
    await RedisSubscription.getInstance().handlerDelKeys(MainkeysRedis.SUBS_ID, subscriptionId);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_SUBS);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_INV);
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: ShopsResourcesModel): ShopsResourcesInterface {
    if (!model) return;
    const entity: ShopsResourcesInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    entity.shopId = enCryptFakeId(entity.shopId);
    return entity;
  }
}
