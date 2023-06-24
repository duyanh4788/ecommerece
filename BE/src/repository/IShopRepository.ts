import { ShopInterface } from '../interface/ShopInterface';

export interface IShopRepository {
  registed(reqBody: ShopInterface, userId: string): Promise<void>;

  updated(reqBody: ShopInterface, userId: string): Promise<void>;

  deleted(id: string, userId: string): Promise<void>;

  getLists(userId: string, roleId?: string): Promise<ShopInterface[]>;

  getShopById(shopId: string, userId?: string, roleId?: string): Promise<ShopInterface>;

  adminApprovedShop(shopId: string): Promise<ShopInterface>;
}
