import { Request, Response, NextFunction } from 'express';
import { TypeOfValue, isCheckedTypeValues } from '../../utils/validate';
import { SendRespone } from '../../services/success/success';
import { Messages } from '../../common/messages';
import { StatusRes } from '../../common/variable';

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
        status: StatusRes.ERROR,
        code: 404,
        message: Messages.PAYLOAD_AVAILABLE
      }).send(res);
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return new SendRespone({
        status: StatusRes.ERROR,
        code: 404,
        message: Messages.PAYLOAD_AVAILABLE
      }).send(res);
    }
    next();
  }

  public async validateSignIn(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!isCheckedTypeValues(email, TypeOfValue.STRING) || !isCheckedTypeValues(password, TypeOfValue.STRING)) {
      return new SendRespone({ status: StatusRes.ERROR, code: 404, message: Messages.PAYLOAD_AVAILABLE }).send(res);
    }
    next();
  }

  public async validateUpdate(req: Request, res: Response, next: NextFunction) {
    const { fullName, phone, password, avatar } = req.body;
    if (
      (!fullName && !phone && !password && !avatar) ||
      (fullName && !isCheckedTypeValues(fullName, TypeOfValue.STRING)) ||
      (phone && !isCheckedTypeValues(phone, TypeOfValue.NUMBER)) ||
      (avatar && !isCheckedTypeValues(avatar, TypeOfValue.STRING)) ||
      (password && !isCheckedTypeValues(password, TypeOfValue.STRING))
    ) {
      return new SendRespone({ status: StatusRes.ERROR, code: 404, message: Messages.PAYLOAD_AVAILABLE }).send(res);
    }
    next();
  }
}
