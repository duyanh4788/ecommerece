import { IUserRepository } from '../repository/IUserRepository';
import * as bcrypt from 'bcryptjs';
import { RestError } from '../services/error/error';
import { hashTokenPasswordInput, encryptTokenPasswordOutput, genarateKeyPairSync, compareSyncPasswordInput } from '../utils/handlerTokenPassword';
import { UserAttributes, UserRole } from '../interface/UserInterface';
import { ITokenUsersRepository } from '../repository/ITokenUsersRepository';
import { RedisUsers } from '../redis/users/RedisUsers';
import { deCryptFakeId } from '../utils/fakeid';
export class UserUseCase {
  private redisUsers: RedisUsers = new RedisUsers();
  constructor(private userRepository: IUserRepository, private tokenUsersRepository: ITokenUsersRepository) {}

  async userSigninUseCase(email: string, password: string) {
    let user: UserAttributes = await this.redisUsers.handlerGetUserByEmail(email);
    if (!user) throw new RestError('account not found!', 404);
    if (!user.activate) throw new RestError('account is disabled!', 404);
    const isPassWord = compareSyncPasswordInput(password, user.password);
    if (!isPassWord) throw new RestError('Password is wrong!', 400);
    const { privateKey, publicKey } = genarateKeyPairSync();
    const keyStores = await this.tokenUsersRepository.createTokenUsers(user.id, publicKey, privateKey);
    await this.redisUsers.handlerUpdateTokenUserByUserId(user.id, keyStores);
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
    await this.redisUsers.handlerDelTokenUserByUserId(userId);
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
}
