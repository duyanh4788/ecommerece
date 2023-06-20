import { Router } from 'express';
import { UsersRoutes } from './users/UserRouter';

export class Routers {
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public routes(app: Router): Router {
    this.usersRoutes.routes(app);
    return Router();
  }
}
