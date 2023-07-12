export interface ShopInterface {
  id?: string | number | any;
  shopId?: string | number | any;
  userId?: string | number | any;
  nameShop?: string;
  banners?: string[];
  sliders?: string[];
  prodcutSell?: any[];
  numberProduct?: number;
  numberItem?: number;
  status?: boolean;
  createdAt?: Date;
}
