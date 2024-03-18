import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IAuthenticatesCodesRepository } from '../../repository/IAuthenticatesCodesRepository';
import { AuthenticatesCodesInterface } from '../../interface/AuthenticatesCodesInterface';
import { AuthenticatesCodesModel } from '../model/AuthenticatesCodesModel';
import { RestError } from '../../services/error/error';
import { redisController } from '../../redis/RedisController';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';

export class AuthenticatesCodesSequelize implements IAuthenticatesCodesRepository {
  async createAuthCode(userId: string, authCode: string, transactionDb?: Transaction): Promise<AuthenticatesCodesInterface> {
    const [auths, created] = await AuthenticatesCodesModel.findOrCreate({
      where: { userId: deCryptFakeId(userId) },
      defaults: { authCode, dateTimeCreate: new Date() }
    });
    if (!created) {
      auths.authCode = authCode;
      auths.dateTimeCreate = new Date();
      await auths.save();
    }
    return this.transformModelToEntity(auths);
  }

  async findByUserId(userId: string): Promise<AuthenticatesCodesInterface> {
    const key = `${MainkeysRedis.AUTH_USERID}${userId}`;
    let authRedis = await redisController.getRedis(key);
    if (!authRedis) {
      const authModel = await AuthenticatesCodesModel.findOne({ where: { userId: deCryptFakeId(userId) } });
      if (!authModel) return;
      authRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(authModel) });
    }
    return authRedis;
  }

  async findByAuthCode(authCode: string): Promise<AuthenticatesCodesInterface> {
    const key = `${MainkeysRedis.AUTH_CODE}${authCode}`;
    let authRedis = await redisController.getRedis(key);
    if (!authRedis) {
      const authModel = await AuthenticatesCodesModel.findOne({ where: { authCode } });
      if (!authModel) return;
      authRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(authModel) });
    }
    return authRedis;
  }

  async deleteAuthCodeByUserId(userId: string, authCode: string, transactionDb: Transaction): Promise<void> {
    const auths = await AuthenticatesCodesModel.findOne({ where: { userId: deCryptFakeId(userId) } });
    if (!auths || auths.authCode !== authCode) throw new RestError('code invalid!', 404);
    await auths.destroy({ transaction: transactionDb });
    await redisController.delRedis(`${MainkeysRedis.AUTH_CODE}${authCode}`);
    await redisController.delRedis(`${MainkeysRedis.AUTH_USERID}${userId}`);
    return;
  }
  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: AuthenticatesCodesModel): AuthenticatesCodesInterface {
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
