import { ItemsInterface } from './ItemsInterface';

export interface ProductsInterface {
  id?: string | number | any;
  nameProduct?: string;
  avatar?: string;
  status?: boolean;
  createdAt?: Date;
  items?: ItemsInterface[];
}

export interface ShopProductsInterface {
  products?: ProductsInterface;
}
