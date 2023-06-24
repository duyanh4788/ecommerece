import { Router } from 'express';
import { MapServices } from '../../infrastructure/MapServices';

const BASE_ROUTE = '/users';

enum Routes {
  SIGNIN = '/signin',
  SIGNUP = '/signup',
  SIGNOUT = '/signout',
  GET_USER_BY_ID = '/get-user-by-id',
  FOR_GOT_PW = '/forgot-password',
  RESEND_ORDER_RESET_PASSWORD = '/resend-order-reset-password',
  RESET_PASSWORD = '/reset-password',
  UPDATE_PROFILE = '/update-profile'
}

export class UsersRoutes {
  private authUserMiddleware: MapServices['authUserMiddleware'] = new MapServices().authUserMiddleware;
  private verifyTokenMiddleware: MapServices['verifyTokenMiddleware'] = new MapServices().verifyTokenMiddleware;
  private usersController: MapServices['usersController'] = new MapServices().usersController;
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
  }
}
