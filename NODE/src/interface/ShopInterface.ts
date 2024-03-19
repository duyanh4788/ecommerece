import { ProductsInterface } from './ProductsInterface';

export interface ShopInterface {
  id?: string | number | any;
  shopId?: string | number | any;
  userId?: string | number | any;
  nameShop?: string;
  banners?: string[];
  sliders?: string[];
  productIds?: number[] | string[];
  productsSell?: ProductsInterface[];
  numberProduct?: number;
  numberItem?: number;
  status?: boolean;
  createdAt?: Date;
}
