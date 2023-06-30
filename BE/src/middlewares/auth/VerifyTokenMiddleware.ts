import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SendRespone } from '../../services/success/success';
import { UserRole } from '../../interface/UserInterface';
import { RedisUsers } from '../../redis/users/RedisUsers';
import { RestError } from '../../services/error/error';
import { TokenUserInterface } from '../../interface/TokenUserInterface';

enum HEADER {
  AUTHORIZATION = 'authorization',
  REFRESH_TOKEN = 'refreshtoken',
  CLIENT_ID = 'client_id'
}

export class VerifyTokenMiddleware {
  public authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deCodePublicKey = await this.configHeaderToken(String(req.headers[HEADER.AUTHORIZATION]), String(req.headers[HEADER.CLIENT_ID]), true, req);
      const refreshToKen = String(req.headers[HEADER.REFRESH_TOKEN]);
      if (refreshToKen) {
        req.refreshToKen = refreshToKen;
      }
      req.user = deCodePublicKey;
      return next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        const restError = new RestError(error.message, 401);
        return RestError.manageServerError(res, restError, false);
      }
      if (error.name === 'TokenExpiredError') {
        const restError = new RestError('token expired', 406);
        return RestError.manageServerError(res, restError, false);
      }
      return RestError.manageServerError(res, error, false);
    }
  };

  public refreshTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deCodePrivateKey = await this.configHeaderToken(String(req.headers[HEADER.REFRESH_TOKEN]), String(req.headers[HEADER.CLIENT_ID]), false, req);
      req.user = deCodePrivateKey;
      req.refreshToKen = String(req.headers[HEADER.REFRESH_TOKEN]);
      return next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        const restError = new RestError(error.message, 401);
        return RestError.manageServerError(res, restError, false);
      }
      return RestError.manageServerError(res, error, false);
    }
  };

  private configHeaderToken = async (token: string, userId: string, typeToken: boolean, req?: Request) => {
    if (!token || token === 'undefined') {
      throw new RestError('your expired, please login', 401);
    }
    if (!userId || token === 'undefined') {
      throw new RestError('invalid request!', 401);
    }
    const tokenUser: TokenUserInterface = await RedisUsers.getInstance().handlerGetTokenUserByUserId(userId as string);
    if (!tokenUser) {
      throw new RestError('invalid request!', 401);
    }
    if (!typeToken) {
      if (!tokenUser.refreshTokens.length || !tokenUser.refreshTokens.includes(token)) {
        throw new RestError('invalid request!', 404);
      }
    }
    const decode: any = JWT.verify(token, typeToken ? tokenUser.publicKey : tokenUser.privateKey);
    if (!tokenUser.tokens || !tokenUser.tokens.length || !tokenUser.tokens.includes(token)) {
      await RedisUsers.getInstance().detelteToken(userId);
      throw new RestError('invalid request!', 401);
    }
    if (decode.userId !== userId) throw new RestError('invalid request!', 401);
    req.tokenUser = tokenUser;
    req.token = token;
    return decode;
  };

  public permissionsRoleAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req;
    if (user && user.roleId === UserRole.ADMIN) {
      return next();
    }
    return new SendRespone({ code: 401, message: 'you are does not permissions admin!' }).send(res);
  };

  public permissionsRoleOwnerShop = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req;
    if (user && user.roleId === UserRole.OWNER_SHOP) {
      return next();
    }
    return new SendRespone({ code: 401, message: 'you are does not permissions owner!' }).send(res);
  };
}
