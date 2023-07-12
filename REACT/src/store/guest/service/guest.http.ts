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

  public getListItemsByProId = (id: string, nextPage: number): Promise<any> => {
    return httpRequest().get(
      GuestApi.GET_LIST_ITEMS_BY_PRO_ID + '/' + id + `?page=${nextPage || ''}`,
    );
  };
}
