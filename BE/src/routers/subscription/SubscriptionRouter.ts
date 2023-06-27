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
  USER_CANCELED_SUBS = '/user-cancel-subscription'
}

export class SubscriptionRouter {
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private subscriptionController: MapServices['subscriptionController'] = new MapServices().subscriptionController;
  constructor() {}

  public routes(app: Router): void {
    app.get(BASE_ADMIN + RoutesAdmin.GET_SUBS, this.verifyTokenMiddleware.auThenticate, this.verifyTokenMiddleware.permissionsRoleAdmin, this.subscriptionController.adminFindAllSubscription);
    app.get(BASE_ADMIN + RoutesAdmin.GET_INVOICES, this.verifyTokenMiddleware.auThenticate, this.verifyTokenMiddleware.permissionsRoleAdmin, this.subscriptionController.adminFindAllInvoices);
    app.get(BASE_PLANS + RoutesPlan.GET_PLANS, this.subscriptionController.getPlans);
    app.get(BASE_SUBS + RoutesSubs.USER_GET_SUBSCRIPTION, this.verifyTokenMiddleware.auThenticate, this.subscriptionController.userGetSubscription);
    app.get(BASE_SUBS + RoutesSubs.USER_GET_INVOICES, this.verifyTokenMiddleware.auThenticate, this.subscriptionController.userGetInvoices);
    app.post(BASE_SUBS + RoutesSubs.USER_SUBSCRIBER, this.verifyTokenMiddleware.auThenticate, this.subscriptionController.userSubscriber);
    app.post(BASE_SUBS + RoutesSubs.USER_CHANGE_SUBS, this.verifyTokenMiddleware.auThenticate, this.subscriptionController.userChanged);
    app.post(BASE_SUBS + RoutesSubs.USER_CANCELED_SUBS, this.verifyTokenMiddleware.auThenticate, this.subscriptionController.userCanceled);
  }
}
