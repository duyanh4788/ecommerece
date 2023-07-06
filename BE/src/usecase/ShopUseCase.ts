import { RedisUsers } from '../redis/users/RedisUsers';
import { ShopInterface } from '../interface/ShopInterface';
import { IShopRepository } from '../repository/IShopRepository';
import { UserRole } from '../interface/UserInterface';
import { ISubscriptionRepository } from '../repository/ISubscriptionRepository';
import { SubscriptionStatus } from '../interface/SubscriptionInterface';
import { RestError } from '../services/error/error';
import { Transaction } from 'sequelize';
import { RedisSubscription } from '../redis/subscription/RedisSubscription';
import { IntegerValue, TypeDecInc } from '../interface/ShopsResourcesInterface';
import { IShopsResourcesRepository } from '../repository/IShopsResourcesRepository';
export class ShopUseCase {
  constructor(private shopUsersRepository: IShopRepository, private subscriptionRepository: ISubscriptionRepository, private shopsResourcesRepository: IShopsResourcesRepository) {}

  async registedShopUseCase(reqBody: ShopInterface, userId: string) {
    const shops = await this.shopUsersRepository.findShopDisable(userId);
    if (shops) {
      throw new RestError('you do not subscribe previous Shop so can not register a new shop, please subscribe to PayPal!', 404);
    }
    return await this.shopUsersRepository.registed(reqBody, userId);
  }

  async updatedShopUseCase(reqBody: ShopInterface, userId: string) {
    return await this.shopUsersRepository.updated(reqBody, userId);
  }

  async updatedSlidersUseCase(reqBody: ShopInterface, userId: string) {
    const { id, sliders } = reqBody;
    return await this.shopUsersRepository.updatedSliders(sliders, id, userId);
  }

  async deletedShopUseCase(id: string, userId: string) {
    const subs = await RedisSubscription.getInstance().getSubsByShopId(id);
    if (subs) throw new RestError('you have subscription so you can not delete shop, please contact admin!', 404);
    return await this.shopUsersRepository.deleted(id, userId);
  }

  async getListsShopUseCase(userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getLists(userId, roleId);
    }
    return await RedisUsers.getInstance().handlerGetShopsUserId(userId);
  }

  async getShopByIdUseCase(shopId: string, userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getShopById(shopId, roleId);
    }
    return await RedisUsers.getInstance().handlerGetShopId(userId, shopId);
  }

  async updateStatusShopUseCase(shopId: string, status: boolean) {
    return await this.shopUsersRepository.updateStatusShopById(shopId, status);
  }
}
