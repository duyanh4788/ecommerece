import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { UserUseCase } from '../usecase/UserUseCase';
import { nodeMailerServices } from '../services/nodemailer/MailServices';
import { TypeOfValue, isCheckedTypeValues } from '../utils/validate';
import { sequelize } from '../database/sequelize';

export class UsersController {
  constructor(private userUseCase: UserUseCase) {}

  public userSignin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const token = await this.userUseCase.userSigninUseCase(email, password);
      return new SendRespone({ data: token, message: 'signin successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public userSignUp = async (req: Request, res: Response) => {
    try {
      const user = await this.userUseCase.userSginUpUseCase(req.body);
      nodeMailerServices.sendWelcomeUserNotification(user.email);
      return new SendRespone({ data: user, message: 'signup successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public userSignOut = async (req: Request, res: Response) => {
    try {
      const { tokenUser, refreshToKen, token } = req;
      if (!refreshToKen) {
        throw new RestError('invalid request!', 404);
      }
      await this.userUseCase.userSginOutUseCase(tokenUser, refreshToKen, token);
      return new SendRespone({ message: 'signout successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!isCheckedTypeValues(email, TypeOfValue.STRING)) {
        throw new RestError('invalid request!', 404);
      }
      const user = await this.userUseCase.getUserByEmailUseCase(email);
      const authenticates = await this.userUseCase.forgotPasswordUseCase(user.id);
      nodeMailerServices.sendAuthCodeResetPassWord(user, authenticates.authCode);
      return new SendRespone({ message: 'we have send authenticator code to email!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public resendForgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!isCheckedTypeValues(email, TypeOfValue.STRING)) {
        throw new RestError('invalid request!', 404);
      }
      const user = await this.userUseCase.getUserByEmailUseCase(email);
      const authenticates = await this.userUseCase.resendForgotPasswordUseCase(user.id);
      nodeMailerServices.sendAuthCodeResetPassWord(user, authenticates.authCode);
      return new SendRespone({ message: 'we have send authenticator code to email!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public resetForgotPassword = async (req: Request, res: Response) => {
    const transactionDb = await sequelize.transaction();
    try {
      const { authCode, newPassWord, email } = req.body;
      if (!isCheckedTypeValues(email, TypeOfValue.STRING) || !isCheckedTypeValues(authCode, TypeOfValue.STRING) || !isCheckedTypeValues(newPassWord, TypeOfValue.STRING)) {
        throw new RestError('invalid request!', 404);
      }
      const user = await this.userUseCase.getUserByEmailUseCase(email);
      await this.userUseCase.resetForgotPasswordUseCase(user.id, authCode, transactionDb);
      await this.userUseCase.updatePasswordUseCase(user.id, newPassWord, email, transactionDb);
      await transactionDb.commit();
      return new SendRespone({ message: 'update password successfully!' }).send(res);
    } catch (error) {
      await transactionDb.rollback();
      return RestError.manageServerError(res, error, false);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      const userModel = await this.userUseCase.getUserByIdUseCase(user.userId);
      return new SendRespone({ data: userModel }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public updateProfile = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      await this.userUseCase.updateProfileUseCase(req.body, user.userId);
      return new SendRespone({ message: 'update successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public refreshToken = async (req: Request, res: Response) => {
    try {
      const { user, refreshToKen, token, tokenUser } = req;
      if (!tokenUser) {
        throw new RestError('you expired, please login!', 404);
      }
      const tokenPayload = await this.userUseCase.refresTokenUseCase(user.userId, refreshToKen, token, tokenUser);
      if (!tokenPayload) {
        throw new RestError('you expired, please login!', 404);
      }
      return new SendRespone({ data: tokenPayload }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };
}
