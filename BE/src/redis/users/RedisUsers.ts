import { ShopSequelize } from '../../database/sequelize/ShopSequelize';
import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { IShopRepository } from '../../repository/IShopRepository';
import { RestError } from '../../services/error/error';
import { redisController } from '../RedisController';

export enum MainkeysRedis {
  TOKEN = 'token_users:',
  USER_ID = 'user:',
  SHOPS_USERID = 'shops_userid:',
  SHOP_ID = 'shop_id:',
  ADMIN_SHOP_ID = 'admin_shop_id:',
  ADMIN_SHOPS = 'admin_shops:',
  PRODUCTS = 'products:'
}

export class RedisUsers {
  private tokenUsersRepository: TokenUsersSequelize = new TokenUsersSequelize();
  private usersRepository: UserSequelize = new UserSequelize();
  private shopSequelize: ShopSequelize = new ShopSequelize();

  public async handlerGetUserByEmail(email: string) {
    let userRedis = await redisController.getRedis(email);
    if (!userRedis) {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) throw new RestError('user not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: email, value: user });
    }
    return userRedis;
  }

  public async handlerDelKeysEmail(email: string) {
    await redisController.delRedis(email);
  }

  public async handlerGetUserById(mainKeys: string, userId: string) {
    let userRedis = await redisController.getRedis(`${mainKeys}${userId}`);
    if (!userRedis) {
      const user = await this.usersRepository.findById(userId);
      if (!user) throw new RestError('user not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: user });
    }
    return userRedis;
  }

  public async handlerGetTokenUserByUserId(mainKeys: string, userId: string) {
    let userRedis = await redisController.getRedis(`${mainKeys}${userId}`);
    if (!userRedis) {
      const tokenUser = await this.tokenUsersRepository.findByUserId(userId);
      if (!tokenUser) throw new RestError('token not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: tokenUser });
    }
    return userRedis;
  }

  public async handlerGetShopsUserId(mainKeys: string, userId: string) {
    let shopsRedis = await redisController.getRedis(`${mainKeys}${userId}`);
    if (!shopsRedis) {
      const shops = await this.shopSequelize.getLists(userId);
      if (!shops) throw new RestError('token not found!', 404);
      shopsRedis = await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: shops });
    }
    return shopsRedis;
  }

  public async handlerGetShopId(mainKeys: string, userId: string, shopId: string) {
    let shopRedis = await redisController.getRedis(`${mainKeys}${shopId}`);
    if (!shopRedis) {
      const shop = await this.shopSequelize.getShopById(shopId, userId);
      if (!shop) throw new RestError('token not found!', 404);
      shopRedis = await redisController.setRedis({ keyValue: `${mainKeys}${shopId}`, value: shop });
    }
    return shopRedis;
  }

  public async handlerUpdateKeys(mainKeys: string, userId: string, tokenUser: TokenUserInterface) {
    await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: tokenUser });
  }

  public async handlerDelKeys(mainKeys: string, userId: string) {
    await redisController.delRedis(`${mainKeys}${userId}`);
  }
}
