import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { RestError } from '../../services/error/error';
import { IUsersResourcesRepository } from '../../repository/IUsersResourcesRepository';
import { IntegerValue, UsersResourcesInterface } from '../../interface/UsersResourcesInterface';
import { UsersResourcesModel } from '../model/UsersResourcesModel';
import { RedisSubscription } from '../../redis/subscription/RedisSubscription';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class UsersResourcesSequelize implements IUsersResourcesRepository {
  async findByUserId(userId: string): Promise<UsersResourcesInterface> {
    const resource = await UsersResourcesModel.findOne({ where: { userId: deCryptFakeId(userId) } });
    return this.transformModelToEntity(resource);
  }

  async findById(id: string): Promise<UsersResourcesInterface> {
    const resource = await UsersResourcesModel.findByPk(deCryptFakeId(id));
    return this.transformModelToEntity(resource);
  }

  async create(reqBody: UsersResourcesInterface, subscriptionId: string, transactionDB?: Transaction): Promise<UsersResourcesInterface> {
    const { userId, numberProduct, numberIndex } = reqBody;
    const [resource, created] = await UsersResourcesModel.findOrCreate({
      where: { userId: deCryptFakeId(userId) },
      defaults: { numberProduct, numberIndex },
      transaction: transactionDB
    });
    if (!created) {
      resource.userId = deCryptFakeId(userId);
      resource.numberIndex = numberIndex;
      await resource.save({ transaction: transactionDB });
    }
    await this.handleRedis(userId, subscriptionId);
    return this.transformModelToEntity(resource);
  }

  async decretIncre(userId: string, value: any, type: string, num: number, subscriptionId: string, transactionDb?: Transaction): Promise<void> {
    const resource = await UsersResourcesModel.findOne({ where: { userId: deCryptFakeId(userId) } });
    if (!resource) throw new RestError('resource not available', 404);
    if (type === IntegerValue.DECR) {
      await resource.decrement(value, { by: num, transaction: transactionDb });
    }
    if (type === IntegerValue.INCR) {
      await resource.increment(value, { by: num, transaction: transactionDb });
    }
    await this.handleRedis(userId, subscriptionId);
    return;
  }

  private async handleRedis(userId: string, subscriptionId: string) {
    await RedisSubscription.getInstance().handlerDelKeys(MainkeysRedis.SUBS_USERID, userId);
    await RedisSubscription.getInstance().handlerDelKeys(MainkeysRedis.SUBS_ID, subscriptionId);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_SUBS);
    await RedisSubscription.getInstance().adminDelKeys(MainkeysRedis.ADMIN_INV);
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: UsersResourcesModel): UsersResourcesInterface {
    if (!model) return;
    const entity: TokenUserInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
