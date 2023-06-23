import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SendRespone } from '../../services/success/success';
import { UserRole } from '../../interface/UserInterface';
import { MainkeysRedis, RedisUsers } from '../../redis/users/RedisUsers';
import { RestError } from '../../services/error/error';

export class VerifyTokenMiddleware {
  public async auThenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const redisUsers: RedisUsers = new RedisUsers();
      const token = String(req.header('Authorization'));
      if (!token) {
        throw new RestError('you have do not sign in!', 401);
      }
      const userId = req.header('Client_Id');
      if (!userId) {
        throw new RestError('invalid request!', 401);
      }
      const tokenUser = await redisUsers.handlerGetTokenUserByUserId(MainkeysRedis.TOKEN, userId);
      if (!tokenUser) {
        throw new RestError('invalid request!', 401);
      }
      const deCodePublicKey: any = JWT.verify(token, tokenUser.publicKey);
      if (deCodePublicKey.userId !== userId) throw new RestError('invalid request!', 401);
      req.user = deCodePublicKey;
      return next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        const restError = new RestError(error.message, 401);
        return RestError.manageServerError(res, restError, false);
      }
      return RestError.manageServerError(res, error, false);
    }
  }

  public permissionsRoleAdmin(req: Request, res: Response, next: NextFunction) {
    const { user }: any = req;
    if (user && user.roleId === UserRole.ADMIN) {
      return next();
    }
    return new SendRespone({ code: 401, message: 'you are does not permissions admin!' }).send(res);
  }
}
