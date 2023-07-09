import { ShopSequelize } from '../../database/sequelize/ShopSequelize';
import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { ShopInterface } from '../../interface/ShopInterface';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { UserAttributes } from '../../interface/UserInterface';
import { redisController } from '../RedisController';
export class RedisUsers {
  private tokenUsersRepository: TokenUsersSequelize = new TokenUsersSequelize();
  private usersRepository: UserSequelize = new UserSequelize();
  private shopSequelize: ShopSequelize = new ShopSequelize();
  static instance: RedisUsers;

  private constructor() {}

  public static getInstance(): RedisUsers {
    if (!RedisUsers.instance) {
      RedisUsers.instance = new RedisUsers();
    }
    return RedisUsers.instance;
  }

  public async handlerGetUserByEmail(email: string): Promise<UserAttributes> {
    let userRedis = await redisController.getRedis(email);
    if (!userRedis) {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) return;
      userRedis = await redisController.setRedis({ keyValue: email, value: user });
    }
    return userRedis;
  }

  public async handlerDelKeysEmail(email: string) {
    await redisController.delRedis(email);
  }

  public async handlerGetUserById(userId: string): Promise<UserAttributes> {
    let userRedis = await redisController.getRedis(`${MainkeysRedis.USER_ID}${userId}`);
    if (!userRedis) {
      const user = await this.usersRepository.findById(userId);
      if (!user) return;
      userRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.USER_ID}${userId}`, value: user });
    }
    return userRedis;
  }

  public async handlerGetTokenUserByUserId(userId: string): Promise<TokenUserInterface> {
    let userRedis = await redisController.getRedis(`${MainkeysRedis.TOKEN}${userId}`);
    if (!userRedis) {
      const tokenUser = await this.tokenUsersRepository.findByUserId(userId);
      if (!tokenUser) return;
      userRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.TOKEN}${userId}`, value: tokenUser });
    }
    return userRedis;
  }

  public async handlerGetShopsUserId(userId: string): Promise<ShopInterface[]> {
    let shopsRedis = await redisController.getRedis(`${MainkeysRedis.SHOPS_USERID}${userId}`);
    if (!shopsRedis) {
      const shops = await this.shopSequelize.getLists(userId);
      if (!shops) return [];
      shopsRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SHOPS_USERID}${userId}`, value: shops });
    }
    return shopsRedis;
  }

  public async handlerGetShopId(shopId: string, userId: string): Promise<ShopInterface> {
    let shopRedis = await redisController.getRedis(`${MainkeysRedis.SHOP_ID}${shopId}`);
    if (!shopRedis) {
      const shop = await this.shopSequelize.getShopById(shopId, userId);
      if (!shop) return;
      shopRedis = await redisController.setRedis({ keyValue: `${MainkeysRedis.SHOP_ID}${shopId}`, value: shop });
    }
    return shopRedis;
  }

  public async handlerUpdateKeys(mainKeys: string, userId: string, tokenUser: TokenUserInterface): Promise<void> {
    await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: tokenUser });
  }

  public async handlerDelKeys(mainKeys: string, userId: string): Promise<void> {
    await redisController.delRedis(`${mainKeys}${userId}`);
  }

  public async detelteToken(userId: string): Promise<void> {
    return await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
  }

  public async updateResfAndTokenUserByUserId(id: string, refreshToKen: string, token: string): Promise<void> {
    return await this.tokenUsersRepository.updateResfAndTokenUserByUserId(id, refreshToKen, token);
  }
}
