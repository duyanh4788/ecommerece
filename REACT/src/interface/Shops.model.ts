import { Subscription } from './Subscriptions.model';

export interface Shops {
  id?: string | number | any;
  userId?: string | number | any;
  nameShop?: string;
  banners?: string[];
  sliders?: string[];
  productIds?: string[];
  products?: Products[];
  status?: boolean;
  createdAt?: Date;
  subscription?: Subscription;
  idImageRemove?: string;
}

export interface Products {
  id?: string | number | any;
  nameProduct?: string;
  avatar?: string;
  status?: boolean;
  createdAt?: Date;
}
