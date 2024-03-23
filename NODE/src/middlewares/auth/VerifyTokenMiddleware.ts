import * as JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SendRespone } from '../../services/success/success';
import { UserRole } from '../../interface/UserInterface';
import { RestError } from '../../services/error/error';
import { TokenUserInterface } from '../../interface/TokenUserInterface';
import { TokenUsersSequelize } from '../../database/sequelize/TokenUsersSequelize';
import { Messages } from '../../common/messages';
import { TypeHeader } from '../../common/variable';

export class VerifyTokenMiddleware {
  private tokenUsersRepository: TokenUsersSequelize = new TokenUsersSequelize();

  public authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deCodePublicKey = await this.configHeaderToken(String(req.headers[TypeHeader.AUTHORIZATION]), String(req.headers[TypeHeader.CLIENT_ID]), true, req);
      const refreshToKen = String(req.headers[TypeHeader.REFRESH_TOKEN]);
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
        const restError = new RestError(Messages.TOKEN_EXP, 406);
        return RestError.manageServerError(res, restError, false);
      }
      return RestError.manageServerError(res, error, false);
    }
  };

  public refreshTokenAuth = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToKen = String(req.headers[TypeHeader.REFRESH_TOKEN]);
    const token = String(req.headers[TypeHeader.AUTHORIZATION]);
    try {
      const deCodePrivateKey = await this.configHeaderToken(refreshToKen, String(req.headers[TypeHeader.CLIENT_ID]), false, req);
      req.user = deCodePrivateKey;
      req.refreshToKen = refreshToKen;
      return next();
    } catch (error) {
      if (error.name === TypeHeader.JSON_TOKEN) {
        const restError = new RestError(error.message, 401);
        return RestError.manageServerError(res, restError, false);
      }
      if (error.name === TypeHeader.JSON_EXP) {
        await this.tokenUsersRepository.updateResfAndTokenUserByUserId(req?.tokenUser?.id, refreshToKen, token);
        const restError = new RestError(Messages.TOKEN_EXP, 401);
        return RestError.manageServerError(res, restError, false);
      }
      return RestError.manageServerError(res, error, false);
    }
  };

  private configHeaderToken = async (token: string, userId: string, typeToken: boolean, req?: Request) => {
    if (!token || token === 'undefined') {
      throw new RestError(Messages.TOKEN_EXP, 401);
    }
    if (!userId || userId === 'undefined') {
      throw new RestError(Messages.TOKEN_EXP, 401);
    }
    const tokenUser: TokenUserInterface = await this.tokenUsersRepository.findByUserId(userId as string);
    if (!tokenUser) {
      throw new RestError(Messages.IN_REQ, 401);
    }
    req.tokenUser = tokenUser;
    req.token = token;
    if (!typeToken) {
      if (!tokenUser.refreshTokens.length || !tokenUser.refreshTokens.includes(token)) {
        await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
        throw new RestError(Messages.TOKEN_EXP, 401);
      }
    }
    const decode: any = JWT.verify(token, typeToken ? tokenUser.publicKey : tokenUser.privateKey);
    if (typeToken) {
      if (!tokenUser.tokens || !tokenUser.tokens.length || !tokenUser.tokens.includes(token)) {
        await this.tokenUsersRepository.deleteTokenUserByUserId(userId);
        throw new RestError(Messages.TOKEN_EXP, 401);
      }
    }
    if (decode.userId !== userId) throw new RestError(Messages.IN_REQ, 401);
    return decode;
  };

  public permissionsRoleAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req;
    if (user && user.roleId === UserRole.ADMIN) {
      return next();
    }
    return new SendRespone({ code: 401, message: Messages.ROLE_AD }).send(res);
  };

  public permissionsRoleOwnerShop = (req: Request, res: Response, next: NextFunction) => {
    const { user }: any = req;
    if (user && user.roleId === UserRole.OWNER_SHOP) {
      return next();
    }
    return new SendRespone({ code: 401, message: Messages.ROLE_OW }).send(res);
  };
}
