import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { configResponse, configResponseError } from 'services/request';
import { ShopHttp } from '../service/shop.http';

const shopRequest = new ShopHttp();

export function* registedShop(api, action) {
  try {
    const resPonse = yield call(api.registedShop, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.registedShopSuccess(data));
  } catch (error) {
    yield put(actions.registedShopFail(configResponseError(error)));
  }
}

export function* updatedShop(api, action) {
  try {
    const resPonse = yield call(api.updatedShop, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.updatedShopSuccess(data));
  } catch (error) {
    yield put(actions.updatedShopFail(configResponseError(error)));
  }
}

export function* deletedShop(api, action) {
  try {
    const resPonse = yield call(api.deletedShop, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.deletedShopSuccess(data));
  } catch (error) {
    yield put(actions.deletedShopFail(configResponseError(error)));
  }
}

export function* getListsShop(api, action) {
  try {
    const resPonse = yield call(api.getListsShop, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getListsShopSuccess(data));
  } catch (error) {
    yield put(actions.getListsShopFail(configResponseError(error)));
  }
}

export function* getShopById(api, action) {
  try {
    const resPonse = yield call(api.getShopById, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getShopByIdSuccess(data));
  } catch (error) {
    yield put(actions.getShopByIdFail(configResponseError(error)));
  }
}

export function* prodGetLists(api, action) {
  try {
    const resPonse = yield call(api.prodGetLists, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.prodGetListsSuccess(data));
  } catch (error) {
    yield put(actions.prodGetListsFail(configResponseError(error)));
  }
}

export function* uploadFile(api, action) {
  try {
    const resPonse = yield call(api.uploadFile, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.uploadFileSuccess(data));
  } catch (error) {
    yield put(actions.uploadFileFail(configResponseError(error)));
  }
}

export function* ShopSaga() {
  yield all([
    yield takeLatest(actions.registedShop.type, registedShop, shopRequest),
    yield takeLatest(actions.updatedShop.type, updatedShop, shopRequest),
    yield takeLatest(actions.deletedShop.type, deletedShop, shopRequest),
    yield takeLatest(actions.getListsShop.type, getListsShop, shopRequest),
    yield takeLatest(actions.getShopById.type, getShopById, shopRequest),
    yield takeLatest(actions.prodGetLists.type, prodGetLists, shopRequest),
    yield takeLatest(actions.uploadFile.type, uploadFile, shopRequest),
  ]);
}
