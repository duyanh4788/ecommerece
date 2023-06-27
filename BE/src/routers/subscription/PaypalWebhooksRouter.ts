import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/paypal';

enum Routes {
  EVENT_HANDLER_SUBSCRIPTION = '/event-subscription'
}

export class PaypalWebhooksRouters {
  private paypalAppWebHookController: MapServices['paypalAppWebHookController'] = new MapServices().paypalAppWebHookController;
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.EVENT_HANDLER_SUBSCRIPTION, this.paypalAppWebHookController.eventListenerSubscription);
  }
}
