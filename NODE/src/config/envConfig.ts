export const envConfig = {
  APP_ENV: process.env.APP_ENV,
  APP_PORT: process.env.APP_PORT,
  SERVER_URL: process.env.SERVER_URL,
  FE_URL: process.env.FE_URL,
  STATUS_REMOVE_LOCAL: process.env.STATUS_REMOVE_LOCAL,
  //  PUBLICH
  END_POINT_VIDEOS_PATH: process.env.END_POINT_VIDEOS_PATH,
  END_POINT_IMAGES_PATH: process.env.END_POINT_IMAGES_PATH,
  END_POINT_PRODUCTS_PATH: process.env.END_POINT_PRODUCTS_PATH,
  //  TIMER
  MAX_REQUEST: process.env.MAX_REQUEST,
  LIMIT_REQUEST: process.env.LIMIT_REQUEST,
  LIMIT_TIMER: process.env.LIMIT_TIMER,
  // REDIS
  REDIS_URL: process.env.REDIS_URL,
  // PAYPAL
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  // DBS
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PORT: process.env.DB_PORT,
  DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT
};
