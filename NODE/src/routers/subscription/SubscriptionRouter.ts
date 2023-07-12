import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ADMIN = '/admin';
enum RoutesAdmin {
  GET_SUBS = '/get-all-subscriptions',
  GET_INVOICES = '/get-all-invoices'
}

const BASE_PLANS = '/plans';
enum RoutesPlan {
  GET_PLANS = '/get-plans'
}

const BASE_SUBS = '/subscriptions';
enum RoutesSubs {
  SHOP_GET_SUBSCRIPTION = '/shop-get-subsription/:shopId',
  SHOP_GET_INVOICES = '/shop-get-invoices/:shopId',
  SHOP_SUBSCRIBER = '/shop-subscriber',
  SHOP_CHANGE_SUBS = '/shop-change-subscription',
  SHOP_CANCELED_SUBS = '/shop-cancel-subscription',
  RESPONSE_SUCCESS = '/response-success'
}

export class SubscriptionRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private subscriptionController: MapServices['subscriptionController'] = new MapServices().subscriptionController;
  constructor() {}

  public routes(app: Router): void {
    app.get(BASE_SUBS + RoutesSubs.RESPONSE_SUCCESS, this.subscriptionController.responseSuccess);
    app.get(BASE_PLANS + RoutesPlan.GET_PLANS, this.subscriptionController.getPlans);
    app.get(
      BASE_ADMIN + RoutesAdmin.GET_SUBS,
      this.verifyTokenMiddleware.authenticate,
      this.verifyTokenMiddleware.permissionsRoleAdmin,
      this.verifyTokenMiddleware.authenticate,
      this.subscriptionController.adminFindAllSubscription
    );
    app.get(
      BASE_ADMIN + RoutesAdmin.GET_INVOICES,
      this.verifyTokenMiddleware.authenticate,
      this.verifyTokenMiddleware.permissionsRoleAdmin,
      this.verifyTokenMiddleware.authenticate,
      this.subscriptionController.adminFindAllInvoices
    );
    app.get(BASE_SUBS + RoutesSubs.SHOP_GET_SUBSCRIPTION, this.verifyTokenMiddleware.authenticate, this.subscriptionController.shopGetSubscription);
    app.get(BASE_SUBS + RoutesSubs.SHOP_GET_INVOICES, this.verifyTokenMiddleware.authenticate, this.subscriptionController.shopGetInvoices);
    app.post(BASE_SUBS + RoutesSubs.SHOP_SUBSCRIBER, this.verifyTokenMiddleware.authenticate, this.subscriptionController.shopSubscriber);
    app.post(BASE_SUBS + RoutesSubs.SHOP_CHANGE_SUBS, this.verifyTokenMiddleware.authenticate, this.subscriptionController.shopChanged);
    app.post(BASE_SUBS + RoutesSubs.SHOP_CANCELED_SUBS, this.verifyTokenMiddleware.authenticate, this.subscriptionController.shopCanceled);
  }
}
