import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/shops';

enum Routes {
  REGISTED = '/registed',
  UPDATE = '/updated',
  DELETED = '/deleted',
  GET_LISTS = '/get-lists',
  GET_BY_ID = '/get-by-id/:shopId'
}

export class ShopRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private shopController: MapServices['shopController'] = new MapServices().shopController;
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.REGISTED, this.verifyTokenMiddleware.auThenticate, this.shopController.registedShop);
    app.post(BASE_ROUTE + Routes.UPDATE, this.verifyTokenMiddleware.auThenticate, this.shopController.updatedShop);
    app.post(BASE_ROUTE + Routes.DELETED, this.verifyTokenMiddleware.auThenticate, this.shopController.deletedShop);
    app.get(BASE_ROUTE + Routes.GET_LISTS, this.verifyTokenMiddleware.auThenticate, this.shopController.getListsShop);
    app.get(BASE_ROUTE + Routes.GET_BY_ID, this.verifyTokenMiddleware.auThenticate, this.shopController.getShopById);
  }
}
