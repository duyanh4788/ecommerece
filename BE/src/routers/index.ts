import { Router } from 'express';
import { UsersRoutes } from './users/UserRouter';
import { UploadRouter } from './upload/UploadRouter';
import { ShopRouter } from './shop/ShopRouter';
import { AdminRouter } from './admin/AdminRouter';
import { SubscriptionRouter } from './subscription/SubscriptionRouter';
import { PaypalWebhooksRouters } from './subscription/PaypalWebhooksRouter';

export class Routers {
  public paypalWebhooksRouters: PaypalWebhooksRouters = new PaypalWebhooksRouters();
  public subscriptionRouter: SubscriptionRouter = new SubscriptionRouter();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public uploadRouter: UploadRouter = new UploadRouter();
  public shopRouter: ShopRouter = new ShopRouter();
  public adminRouter: AdminRouter = new AdminRouter();
  public routes(app: Router): Router {
    this.paypalWebhooksRouters.routes(app);
    this.subscriptionRouter.routes(app);
    this.usersRoutes.routes(app);
    this.uploadRouter.routes(app);
    this.shopRouter.routes(app);
    this.adminRouter.routes(app);
    return Router();
  }
}
