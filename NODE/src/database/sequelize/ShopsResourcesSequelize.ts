import { Transaction } from 'sequelize';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { RestError } from '../../services/error/error';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { IShopsResourcesRepository } from '../../repository/IShopsResourcesRepository';
import { IntegerValue, ShopsResourcesInterface } from '../../interface/ShopsResourcesInterface';
import { ShopsResourcesModel } from '../model/ShopsResourcesModel';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { redisController } from '../../redis/RedisController';
import { Messages } from '../../common/messages';

export class ShopsResourcesSequelize implements IShopsResourcesRepository {
  async findByShopId(shopId: string): Promise<ShopsResourcesInterface> {
    const key = `${MainkeysRedis.SHOP_RESOURCE_SHOPID}${shopId}`;
    let shopResourceRedis = await redisController.getRedis(key);
    if (!shopResourceRedis) {
      const shopResourceModel = await ShopsResourcesModel.findOne({ where: { shopId: deCryptFakeId(shopId) } });
      if (!shopResourceModel) return;
      shopResourceRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shopResourceModel) });
    }
    return shopResourceRedis;
  }

  async findById(id: string): Promise<ShopsResourcesInterface> {
    const key = `${MainkeysRedis.SHOP_RESOURCE_ID}${id}`;
    let shopResourceRedis = await redisController.getRedis(key);
    if (!shopResourceRedis) {
      const shopResourceModel = await ShopsResourcesModel.findByPk(deCryptFakeId(id));
      if (!shopResourceModel) return;
      shopResourceRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(shopResourceModel) });
    }
    return shopResourceRedis;
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
    await this.handleDelRedis(resource.id, shopId, subscriptionId);
    return this.transformModelToEntity(resource);
  }

  async decretIncre(shopId: string, value: any, type: string, num: number, subscriptionId: string, transactionDb?: Transaction): Promise<void> {
    const resource = await ShopsResourcesModel.findOne({ where: { shopId: deCryptFakeId(shopId) } });
    if (!resource) throw new RestError(Messages.NOT_AVAILABLE, 404);
    if (type === IntegerValue.DECR) {
      await resource.decrement(value, { by: num, transaction: transactionDb });
    }
    if (type === IntegerValue.INCR) {
      await resource.increment(value, { by: num, transaction: transactionDb });
    }
    await this.handleDelRedis(resource.id, shopId, subscriptionId);
    return;
  }

  private async handleDelRedis(id: number, shopId: string, subscriptionId: string) {
    await RedisSubscription.delSubscriptionRedis(shopId, subscriptionId);
    await RedisSubscription.delResourceRedis(shopId, id);
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
