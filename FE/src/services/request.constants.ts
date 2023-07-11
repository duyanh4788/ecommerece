import { CONFIG_ENV } from 'utils/config';

export const ApiRouter = {
  VITE_APP_DOMAIN_URL: CONFIG_ENV.DOMAIN_URL,
  SOCKET_URL: CONFIG_ENV.SOCKET_URL,
};
