/* eslint-disable react-hooks/exhaustive-deps */
import { httpRequest } from 'services/request';
import { ShopApi } from '../constants/shop.constant';
import { Shops } from 'interface/Shops.model';

export class ShopHttp {
  private configRegisted = (shops: Shops) => {
    return {
      nameShop: shops.nameShop,
      prodcutSell: shops.prodcutSell,
      banners: shops.banners,
    };
  };

  private configUpdated = (shops: Shops) => {
    return {
      id: shops.id,
      nameShop: shops.nameShop,
      prodcutSell: shops.prodcutSell,
      banners: shops.banners,
    };
  };

  public registedShop = (payload: Shops): Promise<any> => {
    return httpRequest().post(ShopApi.REGISTED, {
      ...this.configRegisted(payload),
    });
  };

  public updatedShop = (payload: Shops): Promise<any> => {
    return httpRequest().post(ShopApi.UPDATED, {
      ...this.configUpdated(payload),
    });
  };

  public deletedShop = (id: string): Promise<any> => {
    return httpRequest().post(ShopApi.DELETED, { id });
  };

  public getListsShop = (data: any): Promise<any> => {
    return httpRequest().get(ShopApi.GET_LISTS);
  };

  public getShopById = (id: string): Promise<any> => {
    return httpRequest().get(ShopApi.GET_LISTS + '/' + id);
  };

  public prodGetLists = (): Promise<any> => {
    return httpRequest().get(ShopApi.PROD_GET_LISTS);
  };

  public uploadFile = (data: any): Promise<any> => {
    return httpRequest().post(ShopApi.UPLOAD_FILE, data);
  };
}
