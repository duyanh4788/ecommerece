import { Router } from 'express';
import { UsersRoutes } from './users/UserRouter';
import { UploadRouter } from './upload/UploadRouter';
import { ShopRouter } from './shop/ShopRouter';
import { AdminRouter } from './admin/AdminRouter';
import { SubscriptionRouter } from './subscription/SubscriptionRouter';
import { PaypalWebhooksRouters } from './subscription/PaypalWebhooksRouter';
import { ItemsRouter } from './shop/ItemsRouter';
import { GuestRouter } from './guest/GuestRouter';

export class Routers {
  public paypalWebhooksRouters: PaypalWebhooksRouters = new PaypalWebhooksRouters();
  public subscriptionRouter: SubscriptionRouter = new SubscriptionRouter();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public uploadRouter: UploadRouter = new UploadRouter();
  public shopRouter: ShopRouter = new ShopRouter();
  public itemsRouter: ItemsRouter = new ItemsRouter();
  public adminRouter: AdminRouter = new AdminRouter();
  public guestRouter: GuestRouter = new GuestRouter();
  public routes(app: Router): Router {
    this.paypalWebhooksRouters.routes(app);
    this.guestRouter.routes(app);
    this.subscriptionRouter.routes(app);
    this.usersRoutes.routes(app);
    this.uploadRouter.routes(app);
    this.shopRouter.routes(app);
    this.itemsRouter.routes(app);
    this.adminRouter.routes(app);
    return Router();
  }
}
