import { ITokenUsersRepository } from '../../repository/ITokenUsersRepository';
import { TokenUserModel } from '../model/TokenUserModel';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { redisController } from '../../redis/RedisController';

export class TokenUsersSequelize implements ITokenUsersRepository {
  async createTokenUsers(payload: TokenUserInterface): Promise<TokenUserInterface> {
    const { userId, publicKey, privateKey, refreshToken, token } = payload;
    const [tokenUser, created] = await TokenUserModel.findOrCreate({
      where: { userId: deCryptFakeId(userId) },
      defaults: { publicKey, privateKey, refreshTokens: [refreshToken], tokens: [token] }
    });
    if (!created) {
      if (publicKey) {
        tokenUser.publicKey = publicKey;
      }
      if (privateKey) {
        tokenUser.privateKey = privateKey;
      }
      if (refreshToken) {
        tokenUser.refreshTokens = [...tokenUser.refreshTokens, refreshToken];
      }
      if (token) {
        tokenUser.tokens = [...tokenUser.tokens, token];
      }
      await tokenUser.save();
    }
    const result = this.transformModelToEntity(tokenUser);
    await redisController.setRedis({ keyValue: `${MainkeysRedis.TOKEN}${userId}`, value: result });
    return result;
  }

  async findByUserId(userId: string): Promise<TokenUserInterface> {
    const key = `${MainkeysRedis.TOKEN}${userId}`;
    let userRedis = await redisController.getRedis(key);
    if (!userRedis) {
      const tokenUserModel = await TokenUserModel.findOne({ where: { userId: deCryptFakeId(userId) } });
      if (!tokenUserModel) return;
      userRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(tokenUserModel) });
    }
    return userRedis;
  }

  async deleteTokenUserByUserId(userId: string): Promise<void> {
    await TokenUserModel.destroy({ where: { userId: deCryptFakeId(userId) } });
    await redisController.delRedis(`${MainkeysRedis.TOKEN}${userId}`);

    return;
  }

  async updateResfAndTokenUserByUserId(tokenUserId: string, refreshToKen: string, token: string): Promise<void> {
    const find = await TokenUserModel.findByPk(deCryptFakeId(tokenUserId));
    if (!find) return;
    const resultRef = find.refreshTokens.filter((item) => item !== refreshToKen);
    find.refreshTokens = resultRef;
    const resultToken = find.tokens.filter((item) => item !== token);
    find.tokens = resultToken;
    await find.save();
    const result = this.transformModelToEntity(find);
    await redisController.setRedis({ keyValue: `${MainkeysRedis.TOKEN}${result.userId}`, value: result });
  }

  async updateTokenUserById(tokenUserId: string, tokenOld: string, tokenNew: string): Promise<void> {
    const find = await TokenUserModel.findByPk(deCryptFakeId(tokenUserId));
    const resultToken = find.tokens.filter((item) => item !== tokenOld);
    find.tokens = [...resultToken, tokenNew];
    await find.save();
    const result = this.transformModelToEntity(find);
    await redisController.setRedis({ keyValue: `${MainkeysRedis.TOKEN}${result.userId}`, value: result });
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
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    entity.userId = enCryptFakeId(entity.userId);
    return entity;
  }
}
