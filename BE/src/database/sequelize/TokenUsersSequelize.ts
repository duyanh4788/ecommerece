import { Transaction } from 'sequelize';
import { ITokenUsersRepository } from '../../repository/ITokenUsersRepository';
import { TokenUserModel } from '../model/TokenUserModel';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';

export class TokenUsersSequelize implements ITokenUsersRepository {
  async createTokenUsers(userId: string, publicKey: string, privateKey: string): Promise<TokenUserInterface> {
    const [tokenUser, created] = await TokenUserModel.findOrCreate({
      where: { userId: deCryptFakeId(userId) },
      defaults: { publicKey, privateKey }
    });
    if (!created) {
      tokenUser.publicKey = publicKey;
      tokenUser.privateKey = privateKey;
      await tokenUser.save();
    }
    return this.transformModelToEntity(tokenUser);
  }

  async findByUserId(userId: string): Promise<TokenUserInterface> {
    const tokenUser = await TokenUserModel.findOne({ where: { userId: deCryptFakeId(userId) } });
    return this.transformModelToEntity(tokenUser);
  }

  async deleteTokenUserByUserId(userId: string): Promise<void> {
    await TokenUserModel.destroy({ where: { userId: deCryptFakeId(userId) } });
    return;
  }
  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: TokenUserModel): TokenUserInterface {
    if (!model) return;
    const entity: TokenUserInterface = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      if (key === 'id' || key === 'userId') {
        entity[key] = enCryptFakeId(model[key]);
      } else {
        entity[key] = model[key];
      }
    }
    entity.id = enCryptFakeId(entity.id);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
