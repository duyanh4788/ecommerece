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
  USER_GET_SUBSCRIPTION = '/user-get-subsription',
  USER_GET_INVOICES = '/user-get-invoices',
  USER_SUBSCRIBER = '/user-subscriber',
  USER_CHANGE_SUBS = '/user-change-subscription',
  USER_CANCELED_SUBS = '/user-cancel-subscription',
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
    app.get(BASE_SUBS + RoutesSubs.USER_GET_SUBSCRIPTION, this.verifyTokenMiddleware.authenticate, this.subscriptionController.userGetSubscription);
    app.get(BASE_SUBS + RoutesSubs.USER_GET_INVOICES, this.verifyTokenMiddleware.authenticate, this.subscriptionController.userGetInvoices);
    app.post(BASE_SUBS + RoutesSubs.USER_SUBSCRIBER, this.verifyTokenMiddleware.authenticate, this.subscriptionController.userSubscriber);
    app.post(BASE_SUBS + RoutesSubs.USER_CHANGE_SUBS, this.verifyTokenMiddleware.authenticate, this.subscriptionController.userChanged);
    app.post(BASE_SUBS + RoutesSubs.USER_CANCELED_SUBS, this.verifyTokenMiddleware.authenticate, this.subscriptionController.userCanceled);
  }
}
