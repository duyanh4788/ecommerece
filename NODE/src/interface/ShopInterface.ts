import { ProductsInterface, ShopProductsInterface } from './ProductsInterface';

interface ProductIds {
  id: string;
  status: boolean;
}

export interface ShopInterface {
  id?: string | number | any;
  shopId?: string | number | any;
  userId?: string | number | any;
  nameShop?: string;
  banners?: string[];
  sliders?: string[];
  productIds?: ProductIds[];
  products?: ProductsInterface[];
  shopProducts?: ShopProductsInterface[];
  numberProduct?: number;
  numberItem?: number;
  status?: boolean;
  createdAt?: Date;
}

export enum Reasons {
  SUBSCRIPTION = 'SUBSCRIPTION',
  INVOICES = 'INVOICES',
  ADMIN = 'ADMIN'
}
