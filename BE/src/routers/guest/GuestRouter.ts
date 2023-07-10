import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/guest';

enum Routes {
  GET_LIST_ITEMS = '/get-list-items',
  GET_LIST_ITEMS_BY_PRO_ID = '/get-list-item-by-pro-id/:proId',
  GET_ITEM_BY_ID = '/get-by-id/:id'
}

export class GuestRouter {
  private guestController: MapServices['guestController'] = new MapServices().guestController;
  constructor() {}

  public routes(app: Router): void {
    app.get(BASE_ROUTE + Routes.GET_LIST_ITEMS, this.guestController.getListsItems);
    app.get(BASE_ROUTE + Routes.GET_LIST_ITEMS_BY_PRO_ID, this.guestController.getListsItemsByProId);
    app.get(BASE_ROUTE + Routes.GET_ITEM_BY_ID, this.guestController.getItemsById);
  }
}
