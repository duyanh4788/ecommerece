export enum MainkeysRedis {
  TOKEN = 'token_users:',
  AUTH_USERID = 'auth_userid:',
  AUTH_CODE = 'auth_code:',
  USER_ID = 'user:',
  // ***IMPORTANT*** //
  SHOPS_BY_ID = 'shop_by_id:',
  SUBS_USERID = 'subs_userid:',
  SUBS_BY_SHOP = 'sub_by_shop:',
  SUBS_ID = 'subs_subid:',
  SHOP_RESOURCE_SHOPID = 'shop_resource_shopid:',
  SHOP_RESOURCE_ID = 'shop_resource_id:',
  ADMIN_SUBS = 'admin_subs',
  ADMIN_INV = 'admin_inv',
  INVOICES_BY_SHOP = 'invs_subid:',
  // ***IMPORTANT*** //
  PRODUCTS = 'products:',
  PRODUCT_ID = 'productid:',
  PLANS = 'plans:',
  PLAN_ID = 'plan_id:',
  TIER = 'tier:',
  SOCKET_BY_SHOP = 'socket_by_shop:',
  SOCKET_BY_USER = 'socket_by_user:',
  CHANNLE_SHOP = 'channel_shop:',
  CHANNLE_USER = 'channel_user:',
  // NONE USED
  ADMIN_SHOP_ID = 'admin_shop_id:',
  ADMIN_SHOPS = 'admin_shops:'
}

export enum TypePushlisher {
  SUBSCRIPTION = 'SUBSCRIPTION',
  WAIT_SUBSCRIPTION = 'WAIT_SUBSCRIPTION',
  INVOICES = 'INVOICES',
  ADMIN = 'ADMIN'
}

export interface PayloadPushlisher {
  userId: string;
  shopId: string;
  type: string;
  status: boolean;
  nameShop: string;
  channel: string;
}

export interface PayloadSubcriber {
  userId: string;
  shopId: string;
  type: string;
  messages: string;
}
