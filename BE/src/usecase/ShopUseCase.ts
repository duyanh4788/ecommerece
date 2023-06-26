import { IUserRepository } from '../repository/IUserRepository';
import { MainkeysRedis, RedisUsers } from '../redis/users/RedisUsers';
import { ShopInterface } from '../interface/ShopInterface';
import { IShopRepository } from '../repository/IShopRepository';
import { UserRole } from '../interface/UserInterface';
export class ShopUseCase {
  private redisUsers: RedisUsers = new RedisUsers();
  constructor(private userRepository: IUserRepository, private shopUsersRepository: IShopRepository) {}

  async registedShopUseCase(reqBody: ShopInterface, userId: string) {
    await this.shopUsersRepository.registed(reqBody, userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    return;
  }

  async updatedShopUseCase(reqBody: ShopInterface, userId: string) {
    await this.shopUsersRepository.updated(reqBody, userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOP_ID, reqBody.id);
    return;
  }

  async deletedShopUseCase(id: string, userId: string) {
    await this.shopUsersRepository.deleted(id, userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOPS_USERID, userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOP_ID, id);
    return;
  }

  async getListsShopUseCase(userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getLists(userId, roleId);
    }
    return await this.redisUsers.handlerGetShopsUserId(MainkeysRedis.SHOPS_USERID, userId);
  }

  async getShopByIdUseCase(shopId: string, userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getShopById(shopId, roleId);
    }
    return await this.redisUsers.handlerGetShopId(MainkeysRedis.SHOP_ID, userId, shopId);
  }

  async adminApprovedShopUseCase(shopId: string) {
    const shop = await this.shopUsersRepository.adminApprovedShop(shopId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOPS_USERID, shop.userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.SHOP_ID, shop.id);
    return;
  }
}
