import { Sequelize } from 'sequelize-typescript';
import { envConfig } from '../config/envConfig';

export const sequelize = new Sequelize({
  host: envConfig.DB_HOST,
  username: envConfig.DB_USERNAME,
  password: envConfig.DB_PASSWORD,
  database: envConfig.DB_DATABASE,
  port: parseInt(envConfig.DB_PORT || '0'),
  dialect: 'mysql',
  models: [__dirname + '/model', __dirname + '/model/EAV'],
  logging: false,
  pool: {
    max: parseInt(envConfig.DB_CONNECTION_LIMIT || '0'),
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
