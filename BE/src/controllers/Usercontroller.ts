import { Request, Response } from 'express';
import { SendRespone } from '../services/success/success';
import { RestError } from '../services/error/error';
import { UserUseCase } from '../usecase/UserUseCase';

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
      return new SendRespone({ data: user, message: 'signup successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public userSignOut = async (req: Request, res: Response) => {
    try {
      const { user } = req;
      await this.userUseCase.userSginOutUseCase(user.userId);
      return new SendRespone({ message: 'signout successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public registerOwnerShop = async (req: Request, res: Response) => {
    try {
      await this.userUseCase.userSginUpUseCase(req.body);
      return new SendRespone({ message: 'signup successfully!' }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };

  public getUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new RestError('user id not available!', 404);
      }
      const user = await this.userUseCase.getUserByIdUseCase(userId);
      return new SendRespone({ data: user }).send(res);
    } catch (error) {
      return RestError.manageServerError(res, error, false);
    }
  };
}
