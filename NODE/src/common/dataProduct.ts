import { envConfig } from '../config/envConfig';

const DOMAIN = envConfig.END_POINT_PRODUCTS_PATH;

export const dataProducts = [
  { nameProduct: 'Electronics', avatar: DOMAIN + '/electronic.png', createdAt: new Date(), updatedAt: new Date() },
  { nameProduct: 'Cosmetics', avatar: DOMAIN + '/cosmetics.png', createdAt: new Date(), updatedAt: new Date() },
  { nameProduct: 'Funitures', avatar: DOMAIN + '/funiture.png', createdAt: new Date(), updatedAt: new Date() },
  { nameProduct: 'Clothes', avatar: DOMAIN + '/clothes.png', createdAt: new Date(), updatedAt: new Date() }
];
