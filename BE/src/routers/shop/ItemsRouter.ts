import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/items';

enum Routes {
  CREATED = '/created',
  UPDATE = '/updated',
  DELETED = '/deleted',
  GET_LISTS = '/get-lists/:shopId',
  GET_BY_ID = '/get-by-id/:id'
}

export class ItemsRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private itemsController: MapServices['itemsController'] = new MapServices().itemsController;
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.CREATED, this.verifyTokenMiddleware.authenticate, this.itemsController.createdItems);
    app.post(BASE_ROUTE + Routes.UPDATE, this.verifyTokenMiddleware.authenticate, this.itemsController.updatedItems);
    app.post(BASE_ROUTE + Routes.DELETED, this.verifyTokenMiddleware.authenticate, this.itemsController.deletedItems);
    app.get(BASE_ROUTE + Routes.GET_LISTS, this.verifyTokenMiddleware.authenticate, this.itemsController.getListsItems);
    app.get(BASE_ROUTE + Routes.GET_BY_ID, this.verifyTokenMiddleware.authenticate, this.itemsController.getItemsById);
  }
}
