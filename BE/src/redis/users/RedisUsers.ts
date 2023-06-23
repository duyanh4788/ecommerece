import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { RestError } from '../../services/error/error';
import { redisController } from '../RedisController';

export enum MainkeysRedis {
  TOKEN = 'token_users:',
  USER_ID = 'user:'
}

export class RedisUsers {
  private tokenUsersRepository: TokenUsersSequelize = new TokenUsersSequelize();
  private usersRepository: UserSequelize = new UserSequelize();

  public async handlerGetUserByEmail(email: string) {
    let userRedis = await redisController.getRedis(email);
    if (!userRedis) {
      const user = await this.usersRepository.findByEmail(email);
      if (!user) throw new RestError('user not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: email, value: user });
    }
    return userRedis;
  }

  public async handlerDelKeysEmail(email: string) {
    await redisController.delRedis(email);
  }

  public async handlerGetUserById(mainKeys: string, userId: string) {
    let userRedis = await redisController.getRedis(`${mainKeys}${userId}`);
    if (!userRedis) {
      const user = await this.usersRepository.findById(userId);
      if (!user) throw new RestError('user not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: user });
    }
    return userRedis;
  }

  public async handlerGetTokenUserByUserId(mainKeys: string, userId: string) {
    let userRedis = await redisController.getRedis(`${mainKeys}${userId}`);
    if (!userRedis) {
      const tokenUser = await this.tokenUsersRepository.findByUserId(userId);
      if (!tokenUser) throw new RestError('token not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: tokenUser });
    }
    return userRedis;
  }

  public async handlerUpdateKeys(mainKeys: string, userId: string, tokenUser: TokenUserInterface) {
    await redisController.setRedis({ keyValue: `${mainKeys}${userId}`, value: tokenUser });
  }

  public async handlerDelKeys(mainKeys: string, userId: string) {
    await redisController.delRedis(`${mainKeys}${userId}`);
  }
}
