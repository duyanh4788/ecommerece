import { Router } from 'express';
import { UsersRoutes } from './users/UserRouter';
import { UploadRouter } from './upload/UploadRouter';
import { ShopRouter } from './shop/ShopRouter';
import { AdminRouter } from './admin/AdminRouter';

export class Routers {
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public uploadRouter: UploadRouter = new UploadRouter();
  public shopRouter: ShopRouter = new ShopRouter();
  public adminRouter: AdminRouter = new AdminRouter();
  public routes(app: Router): Router {
    this.usersRoutes.routes(app);
    this.uploadRouter.routes(app);
    this.shopRouter.routes(app);
    this.adminRouter.routes(app);
    return Router();
  }
}
