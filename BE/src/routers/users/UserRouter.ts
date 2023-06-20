import { Router } from 'express';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { UserUseCase } from '../../usecase/UserUseCase';
import { UsersController } from '../../controllers/Usercontroller';
import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';

const BASE_ROUTE = '/users';

enum Routes {
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  SIGNOUT = '/signout',
  REGISTER_OWNER_SHOP = '/register-owner-shop',
  GET_USER_BY_ID = '/get-user-by-id/:userId'
}

export class UsersRoutes {
  private authUserMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private userSequelize: UserSequelize = new UserSequelize();
  private tokenUsersSequelize: TokenUsersSequelize = new TokenUsersSequelize();
  private userUseCase: UserUseCase = new UserUseCase(this.userSequelize, this.tokenUsersSequelize);
  private usersController: UsersController = new UsersController(this.userUseCase);
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.SIGNIN, this.authUserMiddleware.validateSignIn, this.usersController.userSignin);
    app.post(BASE_ROUTE + Routes.SIGNUP, this.authUserMiddleware.validateSignUp, this.usersController.userSignUp);
    app.post(BASE_ROUTE + Routes.SIGNOUT, this.verifyTokenMiddleware.auThenticate, this.usersController.userSignOut);
    app.post(BASE_ROUTE + Routes.REGISTER_OWNER_SHOP, this.verifyTokenMiddleware.auThenticate, this.usersController.registerOwnerShop);
    app.get(BASE_ROUTE + Routes.GET_USER_BY_ID, this.verifyTokenMiddleware.auThenticate, this.usersController.getUserById);
  }
}
