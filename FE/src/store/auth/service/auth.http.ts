import { Users } from 'interface/Users.model';
import { AuthApi } from 'store/auth/constants/auth.constant';
import { httpRequest } from 'services/request';

export class AuthHttp {
  private configSingIn = (user: Users) => {
    return {
      email: user.email,
      password: user.password,
    };
  };

  private configSignUp = (user: Users) => {
    return {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      phone: user.phone,
    };
  };

  private configUpdate = (user: Users) => {
    return {
      password: user.password,
      fullName: user.fullName,
      phone: user.phone,
      avatar: user.avatar,
    };
  };

  private configResetPass = (payload: any, path: string) => {
    switch (path) {
      case AuthApi.FOR_GOT_PW:
        return {
          email: payload.email,
        };
      case AuthApi.RESEND_ORDER_RESET_PASSWORD:
        return {
          email: payload.email,
        };
      case AuthApi.RESET_PASSWORD:
        return {
          email: payload.email,
          newPassWord: payload.newPassWord,
          authCode: payload.authCode,
        };
      default:
        break;
    }
  };

  public signIn = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_IN, {
      ...this.configSingIn(data),
    });
  };

  public refreshToken = (): Promise<any> => {
    return httpRequest(true).post(AuthApi.REFRESH_TOKEN);
  };

  public signUp = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_UP, {
      ...this.configSignUp(data),
    });
  };

  public signOut = (): Promise<any> => {
    return httpRequest(true).post(AuthApi.SIGN_OUT);
  };

  public forgotPassword = (data: any): Promise<any> => {
    return httpRequest().post(AuthApi.FOR_GOT_PW, this.configResetPass(data, AuthApi.FOR_GOT_PW));
  };

  public resendForgotPassword = (data: any): Promise<any> => {
    return httpRequest().post(
      AuthApi.RESEND_ORDER_RESET_PASSWORD,
      this.configResetPass(data, AuthApi.RESEND_ORDER_RESET_PASSWORD),
    );
  };

  public resetForgotPassword = (data: any): Promise<any> => {
    return httpRequest().post(
      AuthApi.RESET_PASSWORD,
      this.configResetPass(data, AuthApi.RESET_PASSWORD),
    );
  };

  public getUserById = (): Promise<any> => {
    return httpRequest().get(AuthApi.GET_USER_BY_ID);
  };

  public updateProfile = (data: any): Promise<any> => {
    return httpRequest().post(AuthApi.UPDATE_PROFILE, this.configUpdate(data));
  };

  public uploadFile = (data: any): Promise<any> => {
    return httpRequest().post(AuthApi.UPLOAD_FILE, data);
  };
}
