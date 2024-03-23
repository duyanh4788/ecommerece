export const SECRETKEY_SESSION = 'AVBE_j7_KjsKPnwenqxCC4eA';
export const SECRETKEY_FAKEID = 'AVBE_j8_KjsKPnwenqxCC4eA';

export enum TypeHeader {
  AUTHORIZATION = 'authorization',
  REFRESH_TOKEN = 'refreshtoken',
  CLIENT_ID = 'client_id',
  JSON_TOKEN = 'JsonWebTokenError',
  JSON_EXP = 'TokenExpiredError'
}

export enum StatusRes {
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum PaymentProcessor {
  PAYPAL = 'PAYPAL'
}

export enum MethodAPI {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}
