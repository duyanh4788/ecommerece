import { Subscription } from './Subscriptions.model';

export interface Shops {
  id?: string | number | any;
  userId?: string | number | any;
  nameShop?: string;
  banners?: string[];
  sliders?: string[];
  prodcutSell?: Products[];
  status?: boolean;
  createdAt?: Date;
  subscription?: Subscription;
}

export interface Products {
  id?: string | number | any;
  nameProduct?: string;
  avatar?: string;
  status?: boolean;
  createdAt?: Date;
}
