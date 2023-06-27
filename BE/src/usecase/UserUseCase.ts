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
import { MainkeysRedis } from '../interface/KeyRedisInterface';
export class UserUseCase {
  private redisUsers: RedisUsers = new RedisUsers();
  constructor(private userRepository: IUserRepository, private tokenUsersRepository: ITokenUsersRepository, private authenticatesCodesRepository: IAuthenticatesCodesRepository) {}

  async userSigninUseCase(email: string, password: string) {
    let user: UserAttributes = await this.redisUsers.handlerGetUserByEmail(email);
    if (!user) throw new RestError('account not found!', 404);
    if (!user.activate) throw new RestError('account is disabled!', 404);
    const isPassWord = compareSyncPasswordInput(password, user.password);
    if (!isPassWord) throw new RestError('Password is wrong!', 400);
    const { privateKey, publicKey } = genarateKeyPairSync();
    const keyStores = await this.tokenUsersRepository.createTokenUsers(user.id, publicKey, privateKey);
    await this.redisUsers.handlerUpdateKeys(MainkeysRedis.TOKEN, user.id, keyStores);
    return encryptTokenPasswordOutput(user, keyStores);
  }

  async userSginUpUseCase(reqBody: UserAttributes) {
    const { fullName, email, phone, password } = reqBody;
    const findEmail = await this.userRepository.findByEmail(email);
    if (findEmail) {
      throw new RestError('email has exits!', 404);
    }
    await this.userRepository.createUser(fullName, email, hashTokenPasswordInput(password), phone, UserRole.USER);
    return;
  }

  async userSginOutUseCase(userId: string) {
    await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
    await this.redisUsers.handlerDelKeys(MainkeysRedis.TOKEN, userId); // del token
    return;
  }

  async getUserByIdUseCase(userId: string) {
    const user = await this.userRepository.findById(userId);
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
    const user = await this.userRepository.findByEmail(email);
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
    const find = await this.authenticatesCodesRepository.findByUserId(userId);
    if (find) {
      throw new RestError('we have send authenticator code to email, please checked to email or resend order code!', 404);
    }
    const authCodes = await this.authenticatesCodesRepository.createAuthCode(userId, ramdomAuthCode(6));
    return authCodes;
  }

  async resendForgotPasswordUseCase(userId: string) {
    const find = await this.authenticatesCodesRepository.findByUserId(userId);
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
    await this.userRepository.updatePasswordByUserId(userId, hashTokenPasswordInput(newPassWord), transactionDb);
    await this.redisUsers.handlerDelKeysEmail(email);
    return;
  }

  async updateProfileUseCase(reqBody: UserAttributes, userId: string) {
    const { password } = reqBody;
    if (password) {
      const newPassWord = hashTokenPasswordInput(password);
      reqBody = { ...reqBody, password: newPassWord };
    }
    const user = await this.userRepository.updateProfile(reqBody, userId);
    await this.redisUsers.handlerDelKeysEmail(user.email);
    return;
  }
}
