const shopPath = (path: string): string => `/shops/${path}`;
const productPath = (path: string): string => `/products/${path}`;
const uploadPath = (path: string): string => `/upload/${path}`;

export const ShopApi = {
  REGISTED: shopPath('registed'),
  UPDATED: shopPath('updated'),
  DELETED: shopPath('deleted'),
  GET_LISTS: shopPath('get-lists'),
  GET_BY_ID: shopPath('get-by-id'),
  UPLOAD_FILE: uploadPath('upload-file'),
  PROD_GET_LISTS: productPath('get-lists'),
};

export const REPONSE_CONSTANT = {
  REGISTED_SUCCESS: 'REGISTED_SUCCESS',
  REGISTED_FAIL: 'REGISTED_FAIL',
  UPDATED_SUCCESS: 'UPDATED_SUCCESS',
  UPDATED_FAIL: 'UPDATED_FAIL',
  DELETED_SUCCESS: 'DELETED_SUCCESS',
  DELETED_FAIL: 'DELETED_FAIL',
  GET_LISTS_SUCCESS: 'GET_LISTS_SUCCESS',
  GET_LISTS_FAIL: 'GET_LISTS_FAIL',
  GET_BY_ID_SUCCESS: 'GET_BY_ID_SUCCESS',
  GET_BY_ID_FAIL: 'GET_BY_ID_FAIL',
  UPLOAD_FILE_SUCCESS: 'UPLOAD_FILE_SUCCESS',
  UPLOAD_FILE_FAIL: 'UPLOAD_FILE_FAIL',
  PROD_GET_LISTS_SUCCESS: 'PROD_GET_LISTS_SUCCESS',
  PROD_GET_LISTS_FAIL: 'PROD_GET_LISTS_FAIL',
};
