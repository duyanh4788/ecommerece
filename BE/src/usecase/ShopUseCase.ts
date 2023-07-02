import { RedisUsers } from '../redis/users/RedisUsers';
import { ShopInterface } from '../interface/ShopInterface';
import { IShopRepository } from '../repository/IShopRepository';
import { UserRole } from '../interface/UserInterface';
import { ISubscriptionRepository } from '../repository/ISubscriptionRepository';
import { SubscriptionStatus } from '../interface/SubscriptionInterface';
import { RestError } from '../services/error/error';
import { IUsersResourcesRepository } from '../repository/IUsersResourcesRepository';
import { Transaction } from 'sequelize';
import { IntegerValue, TypeDecInc } from '../interface/UsersResourcesInterface';
export class ShopUseCase {
  constructor(private shopUsersRepository: IShopRepository, private subscriptionRepository: ISubscriptionRepository, private usersResourcesRepository: IUsersResourcesRepository) {}

  async registedShopUseCase(reqBody: ShopInterface, userId: string, transactionDB: Transaction) {
    const subs = await this.subscriptionRepository.findByUserId(userId);
    if (subs && subs.status === SubscriptionStatus.WAITING_SYNC) {
      throw new RestError('Please waiting system sync with to PayPal!', 404);
    }
    if (!subs || (subs && subs.status !== SubscriptionStatus.ACTIVE)) {
      throw new RestError('you do not subscribe so can not register a shop, please subscribe to PayPal!', 404);
    }
    if (!subs.usersResources.numberProduct) {
      throw new RestError(`you have limit Product, you can upgrade subscription or waiting next payment!`, 404);
    }
    if (reqBody.prodcutSell.length > subs.usersResources.numberProduct) {
      throw new RestError(
        `with tier ${subs.paypalBillingPlans.tier}, you only registed ${subs.usersResources.numberProduct} Product, you can upgrade subscription or registed shop with only 2 Product!`,
        404
      );
    }
    await this.usersResourcesRepository.decretIncre(userId, TypeDecInc.NUMBER_PRODUCT, IntegerValue.DECR, reqBody.prodcutSell.length, subs.subscriptionId, transactionDB);
    return await this.shopUsersRepository.registed(reqBody, userId, true, transactionDB);
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
