import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { UserSequelize } from '../../database/sequelize/UsersSequelize';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { RestError } from '../../services/error/error';
import { redisController } from '../RedisController';

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

  public async handlerGetUserById(id: string) {
    let userRedis = await redisController.getRedis(`user:${id}`);
    if (!userRedis) {
      const user = await this.usersRepository.findById(id);
      if (!user) throw new RestError('user not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `user:${id}`, value: user });
    }
    return userRedis;
  }

  public async handlerGetTokenUserByUserId(userId: string) {
    let userRedis = await redisController.getRedis(`token_users:${userId}`);
    if (!userRedis) {
      const tokenUser = await this.tokenUsersRepository.findByUserId(userId);
      if (!tokenUser) throw new RestError('token not found!', 404);
      userRedis = await redisController.setRedis({ keyValue: `token_users:${userId}`, value: tokenUser });
    }
    return userRedis;
  }

  public async handlerUpdateTokenUserByUserId(userId: string, tokenUser: TokenUserInterface) {
    await redisController.setRedis({ keyValue: `token_users:${userId}`, value: tokenUser });
  }

  public async handlerDelTokenUserByUserId(userId: string) {
    await redisController.delRedis(`token_users:${userId}`);
  }
}
