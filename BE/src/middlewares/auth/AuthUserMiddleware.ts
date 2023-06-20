import { Request, Response, NextFunction } from 'express';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';
import { SendRespone } from '../../services/success/success';

export class AuthUserMiddleware {
  constructor() {}

  public async validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { fullName, email, phone, password } = req.body;
    if (
      !isCheckedTypeValues(fullName, TypeOfValue.STRING) ||
      !isCheckedTypeValues(email, TypeOfValue.STRING) ||
      !isCheckedTypeValues(password, TypeOfValue.STRING) ||
      (phone && !isCheckedTypeValues(phone, TypeOfValue.NUMBER))
    ) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'Please input full information!'
      }).send(res);
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return new SendRespone({
        status: 'error',
        code: 404,
        message: 'Please input correct type email!'
      }).send(res);
    }
    next();
  }

  public async validateSignIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!isCheckedTypeValues(email, TypeOfValue.STRING) || !isCheckedTypeValues(password, TypeOfValue.STRING)) {
      return new SendRespone({ status: 'error', code: 404, message: 'Please input full information!' }).send(res);
    }
    next();
  }
}
