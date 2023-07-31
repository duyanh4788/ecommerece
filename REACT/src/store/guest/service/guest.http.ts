/* eslint-disable @typescript-eslint/no-unused-vars */
import { httpRequest } from 'services/request';
import { GuestApi } from '../constants/guest.constant';

export class GuestHttp {
  public getListProdsItems = (): Promise<any> => {
    return httpRequest().get(GuestApi.GET_LIST_PROD_ITEMS);
  };

  public getItemById = (id: string): Promise<any> => {
    return httpRequest().get(GuestApi.GET_BY_ID + '/' + id);
  };

  public getListItemsByProId = (query: any): Promise<any> => {
    const { prodId, nextPage } = query;
    return httpRequest().get(
      GuestApi.GET_LIST_ITEMS_BY_PRO_ID + '/' + prodId + `?page=${nextPage || ''}`,
    );
  };
}
