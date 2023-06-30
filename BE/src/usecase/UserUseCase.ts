import { IUserRepository } from '../repository/IUserRepository';
import { RestError } from '../services/error/error';
import { hashTokenPasswordInput, encryptTokenPasswordOutput, genarateKeyPairSync, compareSyncPasswordInput } from '../utils/handlerTokenPassword';
import { UserAttributes, UserRole } from '../interface/UserInterface';
import { ITokenUsersRepository } from '../repository/ITokenUsersRepository';
import { RedisUsers } from '../redis/users/RedisUsers';
import { IAuthenticatesCodesRepository } from '../repository/IAuthenticatesCodesRepository';
import { ramdomAuthCode } from '../utils/ramdomAuthCode';
import { checkTimerAuthenticator } from '../utils/timer';
import { Transaction } from 'sequelize';
import { RedisAuthenticate } from '../redis/authenticate/RedisAuthenticate';
import { TokenUserInterface } from '../interface/TokenUserInterface';

export class UserUseCase {
  constructor(private userRepository: IUserRepository, private tokenUsersRepository: ITokenUsersRepository, private authenticatesCodesRepository: IAuthenticatesCodesRepository) {}

  async userSigninUseCase(email: string, password: string) {
    let user: UserAttributes = await RedisUsers.getInstance().handlerGetUserByEmail(email);
    if (!user) throw new RestError('account not found!', 404);
    if (!user.activate) throw new RestError('account is disabled!', 404);
    const isPassWord = compareSyncPasswordInput(password, user.password);
    if (!isPassWord) throw new RestError('Password is wrong!', 400);
    const { id: userId } = user;
    const keyStoresModel = await RedisUsers.getInstance().handlerGetTokenUserByUserId(userId);
    if (keyStoresModel && keyStoresModel.refreshTokens.length >= 5) {
      await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
      throw new RestError('you have login 5 devices, please relogin!', 400);
    }
    if (keyStoresModel) {
      const tokenPayload = encryptTokenPasswordOutput(user, keyStoresModel);
      const payload: TokenUserInterface = {
        userId,
        token: tokenPayload.token,
        refreshToken: tokenPayload.refreshToKen
      };
      await this.tokenUsersRepository.createTokenUsers(payload);
      return tokenPayload;
    }
    const { privateKey, publicKey } = genarateKeyPairSync();
    if (!privateKey || !privateKey) {
      throw new RestError('sign in failed, please relogin!', 404);
    }
    const tokenPayload = encryptTokenPasswordOutput(user, { privateKey, publicKey });
    const payload: TokenUserInterface = {
      userId,
      publicKey,
      privateKey,
      token: tokenPayload.token,
      refreshToken: tokenPayload.refreshToKen
    };
    await this.tokenUsersRepository.createTokenUsers(payload);
    return tokenPayload;
  }

  async userSginUpUseCase(reqBody: UserAttributes) {
    const { fullName, email, phone, password } = reqBody;
    const findEmail = await RedisUsers.getInstance().handlerGetUserByEmail(email);
    if (findEmail) {
      throw new RestError('email has exits!', 404);
    }
    return await this.userRepository.createUser(fullName, email, hashTokenPasswordInput(password), phone, UserRole.USER);
  }

  async userSginOutUseCase(tokenUser: TokenUserInterface, refreshToKen: string, token: string) {
    return await this.tokenUsersRepository.updateResfAndTokenUserByUserId(tokenUser.id, refreshToKen, token);
  }

  async getUserByIdUseCase(userId: string) {
    const user = await RedisUsers.getInstance().handlerGetUserById(userId);
    if (!user) {
      throw new RestError('user not found!', 404);
    }
    if (!user.activate) {
      throw new RestError('user is disabled!', 404);
    }
    delete user.password;
    return user;
  }

  async getUserByEmailUseCase(email: string) {
    const user = await RedisUsers.getInstance().handlerGetUserByEmail(email);
    if (!user) {
      throw new RestError('user not found!', 404);
    }
    if (!user.activate) {
      throw new RestError('user is disabled!', 404);
    }
    delete user.password;
    return user;
  }

  async forgotPasswordUseCase(userId: string) {
    const find = await RedisAuthenticate.getInstance().getByUserId(userId);
    if (find) {
      throw new RestError('we have send authenticator code to email, please checked to email or resend order code!', 404);
    }
    const authCodes = await this.authenticatesCodesRepository.createAuthCode(userId, ramdomAuthCode(6));
    return authCodes;
  }

  async resendForgotPasswordUseCase(userId: string) {
    const find = await RedisAuthenticate.getInstance().getByUserId(userId);
    if (!find) {
      throw new RestError('you can not order reset password!', 404);
    }
    const checkTimes = checkTimerAuthenticator(find.dateTimeCreate);
    if (!checkTimes) {
      throw new RestError('we have send authenticator code to email, please checked to email or try again after 1 hour!', 404);
    }
    const authCode = await this.authenticatesCodesRepository.createAuthCode(userId, ramdomAuthCode(6));
    return authCode;
  }

  async resetForgotPasswordUseCase(userId: string, authCode: string, transactionDb: Transaction) {
    return await this.authenticatesCodesRepository.deleteAuthCodeByUserId(userId, authCode, transactionDb);
  }

  async updatePasswordUseCase(userId: string, newPassWord: string, email: string, transactionDb: Transaction) {
    return await this.userRepository.updatePasswordByUserId(userId, hashTokenPasswordInput(newPassWord), email, transactionDb);
  }

  async updateProfileUseCase(reqBody: UserAttributes, userId: string) {
    const { password } = reqBody;
    if (password) {
      const newPassWord = hashTokenPasswordInput(password);
      reqBody = { ...reqBody, password: newPassWord };
    }
    return await this.userRepository.updateProfile(reqBody, userId);
  }

  async refresTokenUseCase(userId: string, refreshToKen: string, tokenUser: TokenUserInterface) {
    const { refreshTokens, privateKey, publicKey } = tokenUser;
    if (!refreshTokens.length || !refreshTokens.includes(refreshToKen)) {
      await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
      throw new RestError('you expired, please login!', 404);
    }
    const userInfo = await RedisUsers.getInstance().handlerGetUserById(userId);
    return encryptTokenPasswordOutput(userInfo, { privateKey, publicKey }, refreshToKen);
  }
}
