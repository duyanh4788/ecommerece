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

  public signIn = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_IN, {
      ...this.configSingIn(data),
    });
  };

  public signUp = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_UP, {
      ...this.configSignUp(data),
    });
  };

  public signOut = (): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_OUT);
  };

  public getUserById = (): Promise<any> => {
    return httpRequest().get(AuthApi.GET_USER_BY_ID);
  };
}
