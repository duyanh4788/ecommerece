import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { configResponse, configResponseError } from 'services/request';
import { GuestHttp } from '../service/guest.http';

const guestRequest = new GuestHttp();

export function* getListProdsItems(api, action) {
  try {
    const resPonse = yield call(api.getListProdsItems, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getListProdsItemsSuccess(data));
  } catch (error) {
    yield put(actions.getListProdsItemsFail(configResponseError(error)));
  }
}

export function* getListItemsByProId(api, action) {
  try {
    const resPonse = yield call(api.getListItemsByProId, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getListItemsByProIdSuccess(data));
  } catch (error) {
    yield put(actions.getListItemsByProIdFail(configResponseError(error)));
  }
}

export function* getItemById(api, action) {
  try {
    const resPonse = yield call(api.getItemById, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getItemByIdSuccess(data));
  } catch (error) {
    yield put(actions.getItemByIdFail(configResponseError(error)));
  }
}

export function* GuestSaga() {
  yield all([
    yield takeLatest(actions.getListProdsItems.type, getListProdsItems, guestRequest),
    yield takeLatest(actions.getListItemsByProId.type, getListItemsByProId, guestRequest),
    yield takeLatest(actions.getItemById.type, getItemById, guestRequest),
  ]);
}
