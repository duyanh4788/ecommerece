import { Router } from 'express';
import { AuthUserMiddleware } from '../../middlewares/auth/AuthUserMiddleware';
import { VerifyTokenMiddleware } from '../../middlewares/auth/VerifyTokenMiddleware';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { UserUseCase } from '../../usecase/UserUseCase';
import { UsersController } from '../../controllers/Usercontroller';
import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { AuthenticatesCodesSequelize } from '../../database/sequelize/AuthenticatesCodesSequelize';
import { MulterMiddleware } from '../../middlewares/multer/MulterMiddleware';

const BASE_ROUTE = '/users';

enum Routes {
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  SIGNOUT = '/signout',
  GET_USER_BY_ID = '/get-user-by-id',
  FOR_GOT_PW = '/forgot-password',
  RESEND_ORDER_RESET_PASSWORD = '/resend-order-reset-password',
  RESET_PASSWORD = '/reset-password',
  UPDATE_PROFILE = '/update-profile',
  UPLOAD_FILE = '/upload-file',
  REGISTER_OWNER_SHOP = '/register-owner-shop'
}

export class UsersRoutes {
  private authUserMiddleware: AuthUserMiddleware = new AuthUserMiddleware();
  private verifyTokenMiddleware: VerifyTokenMiddleware = new VerifyTokenMiddleware();
  private multerMiddleware: MulterMiddleware = new MulterMiddleware();
  private userSequelize: UserSequelize = new UserSequelize();
  private tokenUsersSequelize: TokenUsersSequelize = new TokenUsersSequelize();
  private authenticatesCodesSequelize: AuthenticatesCodesSequelize = new AuthenticatesCodesSequelize();
  private userUseCase: UserUseCase = new UserUseCase(this.userSequelize, this.tokenUsersSequelize, this.authenticatesCodesSequelize);
  private usersController: UsersController = new UsersController(this.userUseCase);
  constructor() {}

  public routes(app: Router): void {
    app.post(BASE_ROUTE + Routes.SIGNIN, this.authUserMiddleware.validateSignIn, this.usersController.userSignin);
    app.post(BASE_ROUTE + Routes.SIGNUP, this.authUserMiddleware.validateSignUp, this.usersController.userSignUp);
    app.post(BASE_ROUTE + Routes.FOR_GOT_PW, this.usersController.forgotPassword);
    app.post(BASE_ROUTE + Routes.RESEND_ORDER_RESET_PASSWORD, this.usersController.resendForgotPassword);
    app.post(BASE_ROUTE + Routes.RESET_PASSWORD, this.usersController.resetForgotPassword);
    app.post(BASE_ROUTE + Routes.SIGNOUT, this.verifyTokenMiddleware.auThenticate, this.usersController.userSignOut);
    app.get(BASE_ROUTE + Routes.GET_USER_BY_ID, this.verifyTokenMiddleware.auThenticate, this.usersController.getUserById);
    app.post(BASE_ROUTE + Routes.UPDATE_PROFILE, this.verifyTokenMiddleware.auThenticate, this.authUserMiddleware.validateUpdate, this.usersController.updateProfile);
    app.post(BASE_ROUTE + Routes.UPLOAD_FILE, this.verifyTokenMiddleware.auThenticate, this.multerMiddleware.uploadMulter, this.usersController.uploadFile);
    app.post(BASE_ROUTE + Routes.REGISTER_OWNER_SHOP, this.verifyTokenMiddleware.auThenticate, this.usersController.registerOwnerShop);
  }
}
