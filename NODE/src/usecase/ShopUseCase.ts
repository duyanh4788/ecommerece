import { TypePushlisher, ShopInterface } from '../interface/ShopInterface';
import { IShopRepository } from '../repository/IShopRepository';
import { UserRole } from '../interface/UserInterface';
import { ISubscriptionRepository } from '../repository/ISubscriptionRepository';
import { RestError } from '../services/error/error';
import { IShopProductsRepository } from '../repository/IShopProductsRepository';
import { Messages } from '../common/messages';
export class ShopUseCase {
  constructor(private shopUsersRepository: IShopRepository, private subscriptionRepository: ISubscriptionRepository, private shopProductsRepository: IShopProductsRepository) {}

  async registedShopUseCase(reqBody: ShopInterface, userId: string) {
    const shops = await this.shopUsersRepository.findShopDisable(userId);
    if (shops) {
      throw new RestError(Messages.SHOP_NEED_SUBS, 404);
    }
    return await this.shopUsersRepository.registed(reqBody, userId);
  }

  async updatedShopUseCase(reqBody: ShopInterface, userId: string) {
    await this.shopUsersRepository.updated(reqBody, userId);
    if (reqBody.productIds.length) {
      await Promise.all(
        reqBody.productIds.map(async (item) => {
          await this.shopProductsRepository.updated(reqBody.id, item.id, item.status);
        })
      );
    }
  }

  async updatedSlidersUseCase(reqBody: ShopInterface, userId: string) {
    const { id, sliders } = reqBody;
    return await this.shopUsersRepository.updatedSliders(sliders, id, userId);
  }

  async deletedShopUseCase(id: string, userId: string) {
    const subs = await this.subscriptionRepository.findByShopId(id);
    if (subs) throw new RestError(Messages.SHOP_HAS_SUBS, 404);
    await this.shopUsersRepository.deleted(id, userId);
    await this.shopProductsRepository.deletedMany(id);
    return;
  }

  async getListsShopUseCase(userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getLists(userId, roleId);
    }
    return await this.shopUsersRepository.getLists(userId);
  }

  async getShopByIdUseCase(shopId: string, userId: string, roleId?: string) {
    if (roleId && roleId === UserRole.ADMIN) {
      return await this.shopUsersRepository.getShopById(shopId, roleId);
    }
    return await this.shopUsersRepository.getShopById(shopId, userId);
  }

  async updateStatusShopUseCase(shopId: string, status: boolean) {
    return await this.shopUsersRepository.updateStatusShopById(shopId, status, TypePushlisher.ADMIN);
  }
}
