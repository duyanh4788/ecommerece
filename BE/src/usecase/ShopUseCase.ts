import { IUserRepository } from '../repository/IUserRepository';
import { RedisUsers } from '../redis/users/RedisUsers';
import { ShopInterface } from '../interface/ShopInterface';
import { IShopRepository } from '../repository/IShopRepository';
import { UserRole } from '../interface/UserInterface';
import { MainkeysRedis } from '../interface/KeyRedisInterface';
export class ShopUseCase {
  constructor(private userRepository: IUserRepository, private shopUsersRepository: IShopRepository) {}

  async registedShopUseCase(reqBody: ShopInterface, userId: string) {
    return await this.shopUsersRepository.registed(reqBody, userId);
  }

  async updatedShopUseCase(reqBody: ShopInterface, userId: string) {
    return await this.shopUsersRepository.updated(reqBody, userId);
  }

  async deletedShopUseCase(id: string, userId: string) {
    return await this.shopUsersRepository.deleted(id, userId);
  }

  async getListsShopUseCase(userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getLists(userId, roleId);
    }
    return await RedisUsers.getInstance().handlerGetShopsUserId(MainkeysRedis.SHOPS_USERID, userId);
  }

  async getShopByIdUseCase(shopId: string, userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getShopById(shopId, roleId);
    }
    return await RedisUsers.getInstance().handlerGetShopId(MainkeysRedis.SHOP_ID, userId, shopId);
  }

  async adminApprovedShopUseCase(shopId: string) {
    return await this.shopUsersRepository.adminApprovedShop(shopId);
  }
}
