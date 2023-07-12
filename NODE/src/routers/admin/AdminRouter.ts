import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/admin';

enum Routes {
  CRAETED = '/products/created',
  UPDATE = '/products/updated',
  DELETED = '/products/deleted',
  GET_LISTS = '/products/get-lists',
  GET_BY_ID = '/products/get-by-id/:productId',
  APPROVED_SHOP = '/shops/approved',
  GET_LIST_SHOP = '/shops/get-lists',
  GET_SHOP_BY_ID = '/shops/get-by-id/:shopId'
}

export class AdminRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private productsController: MapServices['productsController'] = new MapServices().productsController;
  private shopController: MapServices['shopController'] = new MapServices().shopController;
  constructor() {}

  public routes(app: Router): void {
    app.get(Routes.GET_BY_ID, this.verifyTokenMiddleware.authenticate, this.productsController.getProductById);
    app.get(Routes.GET_LISTS, this.verifyTokenMiddleware.authenticate, this.productsController.getListsProducts);
    const middAuthPer = [this.verifyTokenMiddleware.authenticate, this.verifyTokenMiddleware.authenticate];
    app.post(BASE_ROUTE + Routes.CRAETED, middAuthPer, this.productsController.createdProduct);
    app.post(BASE_ROUTE + Routes.UPDATE, middAuthPer, this.productsController.updatedProduct);
    app.post(BASE_ROUTE + Routes.DELETED, middAuthPer, this.productsController.deletedProduct);
    app.post(BASE_ROUTE + Routes.APPROVED_SHOP, middAuthPer, this.shopController.adminUpdateStatusShop);
    app.get(BASE_ROUTE + Routes.GET_LIST_SHOP, middAuthPer, this.shopController.adminGetListsShop);
    app.get(BASE_ROUTE + Routes.GET_SHOP_BY_ID, middAuthPer, this.shopController.adminGetShopById);
  }
}
