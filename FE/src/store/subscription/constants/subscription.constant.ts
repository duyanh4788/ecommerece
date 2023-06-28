const plansPath = (path: string): string => `/plans/${path}`;
const subScriptionPath = (path: string): string => `/subscriptions/${path}`;

export const SubScriptionApi = {
  GET_PLANS: plansPath('get-plans'),
  USER_GET_SUBSCRIPTION: subScriptionPath('user-get-subsription'),
  USER_GET_INVOICES: subScriptionPath('user-get-invoices'),
  USER_SUBSCRIBER: subScriptionPath('user-subscriber'),
  USER_CHANGE_SUBS: subScriptionPath('user-change-subscription'),
  USER_CANCELED_SUBS: subScriptionPath('user-cancel-subscription'),
};

export const REPONSE_CONSTANT = {
  GET_PLANS_SUCCESS: 'GET_PLANS_SUCCESS',
  GET_PLANS_FAIL: 'GET_PLANS_FAIL',
  USER_GET_SUBSCRIPTION_SUCCESS: 'USER_GET_SUBSCRIPTION_SUCCESS',
  USER_GET_SUBSCRIPTION_FAIL: 'USER_GET_SUBSCRIPTION_FAIL',
  USER_GET_INVOICES_SUCCESS: 'USER_GET_INVOICES_SUCCESS',
  USER_GET_INVOICES_FAIL: 'USER_GET_INVOICES_FAIL',
  USER_SUBSCRIBER_SUCCESS: 'USER_SUBSCRIBER_SUCCESS',
  USER_SUBSCRIBER_FAIL: 'USER_SUBSCRIBER_FAIL',
  USER_CHANGE_SUBS_SUCCESS: 'USER_CHANGE_SUBS_SUCCESS',
  USER_CHANGE_SUBS_FAIL: 'USER_CHANGE_SUBS_FAIL',
  USER_CANCELED_SUBS_SUCCESS: 'USER_CANCELED_SUBS_SUCCESS',
  USER_CANCELED_SUBS_FAIL: 'USER_CANCELED_SUBS_FAIL',
};
