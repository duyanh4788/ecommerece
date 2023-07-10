const guestPath = (path: string): string => `/guest/${path}`;

export const GuestApi = {
  GET_LIST_PROD_ITEMS: guestPath('get-list-items'),
  GET_BY_ID: guestPath('get-by-id'),
  GET_LIST_ITEMS_BY_PRO_ID: guestPath('get-list-item-by-pro-id'),
};

export const REPONSE_CONSTANT = {
  GET_LISTS_SUCCESS: 'GET_LISTS_SUCCESS',
  GET_LISTS_FAIL: 'GET_LISTS_FAIL',
  GET_BY_ID_SUCCESS: 'GET_BY_ID_SUCCESS',
  GET_BY_ID_FAIL: 'GET_BY_ID_FAIL',
};
