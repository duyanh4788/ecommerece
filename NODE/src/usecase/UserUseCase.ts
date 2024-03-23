import { IUserRepository } from '../repository/IUserRepository';
import { RestError } from '../services/error/error';
import { hashTokenPasswordInput, encryptTokenPasswordOutput, genarateKeyPairSync, compareSyncPasswordInput } from '../utils/handlerTokenPassword';
import { UserAttributes, UserRole } from '../interface/UserInterface';
import { ITokenUsersRepository } from '../repository/ITokenUsersRepository';
import { IAuthenticatesCodesRepository } from '../repository/IAuthenticatesCodesRepository';
import { ramdomAuthCode } from '../utils/ramdomAuthCode';
import { checkTimerAuthenticator } from '../utils/timer';
import { Transaction } from 'sequelize';
import { TokenUserInterface } from '../interface/TokenUserInterface';
import { Messages } from '../common/messages';

export class UserUseCase {
  constructor(private userRepository: IUserRepository, private tokenUsersRepository: ITokenUsersRepository, private authenticatesCodesRepository: IAuthenticatesCodesRepository) {}

  async userSigninUseCase(email: string, password: string) {
    let user: UserAttributes = await this.userRepository.findByEmail(email);
    if (!user) throw new RestError(Messages.ACC_NOT_FOUND, 404);
    if (!user.activate) throw new RestError(Messages.ACC_DISABLED, 404);
    const isPassWord = compareSyncPasswordInput(password, user.password);
    if (!isPassWord) throw new RestError(Messages.PASS_WRONG, 400);
    const { id: userId } = user;
    const keyStoresModel = await this.tokenUsersRepository.findByUserId(userId);
    if (keyStoresModel && keyStoresModel.refreshTokens.length >= 5) {
      await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
      throw new RestError(Messages.LOGIN_LIMIT, 400);
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
      throw new RestError(Messages.LOGIN_FAILED, 404);
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
    const findEmail = await this.userRepository.findByEmail(email);
    if (findEmail) {
      throw new RestError(Messages.EMAIL_EXT, 404);
    }
    return await this.userRepository.createUser(fullName, email, hashTokenPasswordInput(password), phone, UserRole.USER);
  }

  async userSginOutUseCase(tokenUser: TokenUserInterface, refreshToKen: string, token: string) {
    return await this.tokenUsersRepository.updateResfAndTokenUserByUserId(tokenUser.id, refreshToKen, token);
  }

  async getUserByIdUseCase(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new RestError(Messages.ACC_NOT_FOUND, 404);
    }
    if (!user.activate) {
      throw new RestError(Messages.ACC_DISABLED, 404);
    }
    delete user.password;
    return user;
  }

  async getUserByEmailUseCase(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new RestError(Messages.ACC_NOT_FOUND, 404);
    }
    if (!user.activate) {
      throw new RestError(Messages.ACC_DISABLED, 404);
    }
    delete user.password;
    return user;
  }

  async forgotPasswordUseCase(userId: string) {
    const find = await this.authenticatesCodesRepository.findByUserId(userId);
    if (find) {
      throw new RestError(Messages.HAS_SEND_AUTH_CODE, 404);
    }
    const authCodes = await this.authenticatesCodesRepository.createAuthCode(userId, ramdomAuthCode(6));
    return authCodes;
  }

  async resendForgotPasswordUseCase(userId: string) {
    const find = await this.authenticatesCodesRepository.findByUserId(userId);
    if (!find) {
      throw new RestError(Messages.RESEND_FORGOT_PASS_ERR, 404);
    }
    const checkTimes = checkTimerAuthenticator(find.dateTimeCreate);
    if (!checkTimes) {
      throw new RestError(Messages.HAS_SEND_OR_TRY_AUTH_CODE, 404);
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

  async refresTokenUseCase(userId: string, refreshToKen: string, token: string, tokenUser: TokenUserInterface) {
    const { id, privateKey, publicKey } = tokenUser;
    const userInfo = await this.userRepository.findById(userId);
    const tokenPayload = encryptTokenPasswordOutput(userInfo, { privateKey, publicKey }, refreshToKen);
    await this.tokenUsersRepository.updateTokenUserById(id, token, tokenPayload.token);
    return tokenPayload;
  }
}
