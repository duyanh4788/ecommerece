const itemPath = (path: string): string => `/items/${path}`;
const uploadPath = (path: string): string => `/upload/${path}`;

export const ItemApi = {
  CREATED: itemPath('created'),
  UPDATED: itemPath('updated'),
  UPDATE_THUMB: itemPath('updated-thumb'),
  DELETED: itemPath('deleted'),
  GET_LISTS: itemPath('get-lists'),
  GET_BY_ID: itemPath('get-by-id'),
  UPLOAD_FILE: uploadPath('upload-file'),
  REMOVE_FILE: uploadPath('remove-file'),
};

export const REPONSE_CONSTANT = {
  CREATED_SUCCESS: 'CREATED_SUCCESS',
  CREATED_FAIL: 'CREATED_FAIL',
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
};
