import { Response } from 'express';

export enum TypeResponse {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum StatusCode {
  SUCCESS = 200,
  AUTH_ERROR = 401,
  LOGIC_ERROR = 400,
  VALIDATE_ERROR = 404,
  SYSTEM = 500
}

interface Success {
  status?: string;
  code?: number;
  data?: any;
  message?: string;
  option?: any;
  success?: boolean;
}

class SuccessResponse {
  public status: string;
  public code: number;
  public data: any;
  public message: string;
  public option: any;
  public success: boolean;

  constructor({ status = TypeResponse.SUCCESS as string, code = StatusCode.SUCCESS, data = null, message = '', option = null }) {
    this.status = status;
    this.code = code || 200;
    this.data = data || null;
    this.message = message || '';
    this.option = option || null;
    this.success = true;
  }

  send(res: Response) {
    return res.status(this.code).json(this);
  }

  redirect(res: Response) {
    return res.redirect(this.data);
  }
}

export class SendRespone extends SuccessResponse {
  constructor({ status, code, data, message, option }: Success) {
    super({ status, code, data, message, option });
  }
}
