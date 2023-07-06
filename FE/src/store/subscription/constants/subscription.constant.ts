const plansPath = (path: string): string => `/plans/${path}`;
const subScriptionPath = (path: string): string => `/subscriptions/${path}`;

export const SubScriptionApi = {
  GET_PLANS: plansPath('get-plans'),
  SHOP_GET_SUBSCRIPTION: subScriptionPath('shop-get-subsription/'),
  SHOP_GET_INVOICES: subScriptionPath('shop-get-invoices/'),
  SHOP_SUBSCRIBER: subScriptionPath('shop-subscriber'),
  SHOP_CHANGE_SUBS: subScriptionPath('shop-change-subscription'),
  SHOP_CANCELED_SUBS: subScriptionPath('shop-cancel-subscription'),
};

export const REPONSE_CONSTANT = {
  GET_PLANS_SUCCESS: 'GET_PLANS_SUCCESS',
  GET_PLANS_FAIL: 'GET_PLANS_FAIL',
  SHOP_GET_SUBSCRIPTION_SUCCESS: 'SHOP_GET_SUBSCRIPTION_SUCCESS',
  SHOP_GET_SUBSCRIPTION_FAIL: 'SHOP_GET_SUBSCRIPTION_FAIL',
  SHOP_GET_INVOICES_SUCCESS: 'SHOP_GET_INVOICES_SUCCESS',
  SHOP_GET_INVOICES_FAIL: 'SHOP_GET_INVOICES_FAIL',
  SHOP_SUBSCRIBER_SUCCESS: 'SHOP_SUBSCRIBER_SUCCESS',
  SHOP_SUBSCRIBER_FAIL: 'SHOP_SUBSCRIBER_FAIL',
  SHOP_CHANGE_SUBS_SUCCESS: 'SHOP_CHANGE_SUBS_SUCCESS',
  SHOP_CHANGE_SUBS_FAIL: 'SHOP_CHANGE_SUBS_FAIL',
  SHOP_CANCELED_SUBS_SUCCESS: 'SHOP_CANCELED_SUBS_SUCCESS',
  SHOP_CANCELED_SUBS_FAIL: 'SHOP_CANCELED_SUBS_FAIL',
};
