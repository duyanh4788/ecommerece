/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { httpRequest } from 'services/request';
import { ItemApi } from '../constants/item.constant';
import { PayloadItems } from 'interface/Items.mode';

export class ItemHttp {
  public createdItem = (payload: PayloadItems): Promise<any> => {
    return httpRequest().post(ItemApi.CREATED, payload);
  };

  public updatedItem = (payload: PayloadItems): Promise<any> => {
    return httpRequest().post(ItemApi.UPDATED, payload);
  };

  public updatedThumb = (payload: any): Promise<any> => {
    return httpRequest().post(ItemApi.UPDATE_THUMB, payload);
  };

  public deletedItem = (id: string): Promise<any> => {
    return httpRequest().post(ItemApi.DELETED, { id });
  };

  public getListsItems = (query: any): Promise<any> => {
    const { id, nextPage, option, search } = query;
    return httpRequest().get(
      ItemApi.GET_LISTS +
        '/' +
        id +
        `?page=${nextPage || ''}&options=${option || ''}&search=${search || ''}`,
    );
  };

  public getItemById = (id: string): Promise<any> => {
    return httpRequest().get(ItemApi.GET_BY_ID + '/' + id);
  };

  public uploadFile = (data: any): Promise<any> => {
    return httpRequest().post(ItemApi.UPLOAD_FILE, data);
  };

  public removeFile = (data: any): Promise<any> => {
    return httpRequest().post(ItemApi.REMOVE_FILE, data);
  };
}
