import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { snakeCase } from 'lodash';
import { LocalStorageService, LocalStorageKey } from './localStorage';
import { ApiRouter } from './request.constants';

export const httpRequest = () => {
  const localService = new LocalStorageService();
  const request: AxiosInstance = axios.create({
    baseURL: ApiRouter.REACT_APP_DOMAIN_URL,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '***',
      Accept: '*/*',
    },
    timeout: 25000,
  });
  const user: any = localService.getItem(LocalStorageKey.user);
  if (user) {
    request.defaults.headers.common['Authorization'] = user.token;
    request.defaults.headers.common['Client_Id'] = user.userId;
  }
  return request;
};

export function configRequest(request: any): any {
  const typeRequest = typeof request;
  let formatRequest: any = {};
  if (typeRequest === 'string') return snakeCase(request);
  if (typeRequest === 'object') {
    for (let i in request) {
      formatRequest[snakeCase(i)] = request[i];
    }
    return formatRequest;
  }
}

export function configResponse(response: AxiosResponse<any>): any {
  if (!response.data) {
    return { message: 'server not found', code: 401 };
  }
  const { data, code, message, success, status } = response.data;
  if (code >= 400 && code <= 500) {
    throw Object.assign(new Error(message), { code });
  }
  return { data, message, code, success, status };
}

export function configResponseError(errors: AxiosError | any): any {
  if (!errors || !errors.response || !errors.response.data) {
    return { message: 'request server not found', code: 404 };
  }
  const { code, message, success, status } = errors.response.data;
  if (!message && code) {
    return { code, message: 'request server not found', status };
  }
  if (message && !code) {
    return { code: 404, message, status };
  }
  return { message, code, success, status };
}
