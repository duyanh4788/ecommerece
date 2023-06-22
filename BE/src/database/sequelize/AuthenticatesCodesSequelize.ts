import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { IAuthenticatesCodesRepository } from '../../repository/IAuthenticatesCodesRepository';
import { AuthenticatesCodesInterface } from '../../interface/AuthenticatesCodesInterface';
import { AuthenticatesCodesModel } from '../model/AuthenticatesCodesModel';

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
    const auths = await AuthenticatesCodesModel.findOne({ where: { userId: deCryptFakeId(userId) } });
    return this.transformModelToEntity(auths);
  }

  async findByAuthCode(authCode: string): Promise<AuthenticatesCodesInterface> {
    const auths = await AuthenticatesCodesModel.findOne({ where: { authCode } });
    return this.transformModelToEntity(auths);
  }

  async deleteAuthCodeByUserId(userId: string, transactionDb: Transaction): Promise<void> {
    await AuthenticatesCodesModel.destroy({ where: { userId: deCryptFakeId(userId) }, transaction: transactionDb });
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
