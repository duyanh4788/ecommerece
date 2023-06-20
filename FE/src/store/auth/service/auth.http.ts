import { ApisauceInstance } from 'apisauce';
import { Users } from 'interface/Users.model';
import { AuthApi } from 'store/auth/constants/auth.constant';
import { ApiRouter } from 'services/request.constants';
import { HttpRequest } from 'services/request';

export class AuthHttp {
  request: ApisauceInstance;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  private configSingIn = (user: Users) => {
    return {
      account: user.account,
      passWord: user.passWord,
    };
  };

  private configSignUp = (user: Users) => {
    return {
      account: user.account,
      passWord: user.passWord,
      fullName: user.fullName,
      email: user.email,
    };
  };

  private configUpdateInfor = (user: Users) => {
    return {
      fullName: user.fullName,
      avatar: user.avatar,
      _id: user._id,
      type2FA: user.type2FA,
      twoFA: user.twoFA,
    };
  };

  private configResetPassWord = (body: any) => {
    return {
      email: body.email,
      newPassWord: body.newPassWord,
      authCode: body.authCode,
    };
  };

  public signInUser = (data: Users): Promise<any> => {
    return this.request.post(AuthApi.SIGN_IN, {
      ...this.configSingIn(data),
    });
  };

  public sigInUserWithCode = (authCode: string): Promise<any> => {
    return this.request.post(AuthApi.SIGN_IN_WITH_CODE, authCode);
  };

  public signUpUser = (data: Users): Promise<any> => {
    return this.request.post(AuthApi.SIGN_UP, {
      ...this.configSignUp(data),
    });
  };

  public signUpWithFB = (data: any): Promise<any> => {
    return this.request.post(AuthApi.LOGIN_FB, {});
  };

  public signUpWithGG = (data: any): Promise<any> => {
    return this.request.post(AuthApi.LOGIN_GG, {});
  };

  public getUserById = ({ id, toKen }): Promise<any> => {
    if (toKen) {
      this.request.setHeaders({
        Authorization: toKen,
      });
    }
    return this.request.get(AuthApi.GET_USER_BY_ID + id);
  };

  public changeStatusOnline = (id: string): Promise<any> => {
    return this.request.post(AuthApi.CHANGE_STATUS_IS_ONLINE, id);
  };

  public updateInfo = (body: any): Promise<any> => {
    const config = this.configUpdateInfor(body);
    return this.request.put(AuthApi.UPDATE_INFOR, config);
  };

  public activeAuthCode = (code: string): Promise<any> => {
    return this.request.get(`${AuthApi.ACTIVE_AUTH_CODE}/${code}`);
  };

  public forgotPassword = (email: any): Promise<any> => {
    return this.request.post(AuthApi.FORGOT_PW, email);
  };

  public resendOrderForgotPassword = (email: any): Promise<any> => {
    return this.request.post(AuthApi.RESEND_ORDER_RESET_PASSWORD, email);
  };

  public resetPassword = (body: any): Promise<any> => {
    return this.request.post(AuthApi.RESET_PASSWORD, this.configResetPassWord(body));
  };
}
