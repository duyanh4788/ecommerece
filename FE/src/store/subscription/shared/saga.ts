import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { configResponse, configResponseError } from 'services/request';
import { SubscriptionHttp } from '../service/subscription.http';

const subscriptionRequest = new SubscriptionHttp();

export function* getPlans(api, action) {
  try {
    const resPonse = yield call(api.getPlans, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getPlansSuccess(data));
  } catch (error) {
    yield put(actions.getPlansFail(configResponseError(error)));
  }
}

export function* shopGetSubscription(api, action) {
  try {
    const resPonse = yield call(api.shopGetSubscription, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.shopGetSubscriptionSuccess(data));
  } catch (error) {
    yield put(actions.shopGetSubscriptionFail(configResponseError(error)));
  }
}

export function* shopGetInvoices(api, action) {
  try {
    const resPonse = yield call(api.shopGetInvoices, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.shopGetInvoicesSuccess(data));
  } catch (error) {
    yield put(actions.shopGetInvoicesFail(configResponseError(error)));
  }
}

export function* shopSubscriber(api, action) {
  try {
    const resPonse = yield call(api.shopSubscriber, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.shopSubscriberSuccess(data));
  } catch (error) {
    yield put(actions.shopSubscriberFail(configResponseError(error)));
  }
}

export function* shopChanged(api, action) {
  try {
    const resPonse = yield call(api.shopChanged, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.shopChangedSuccess(data));
  } catch (error) {
    yield put(actions.shopChangedFail(configResponseError(error)));
  }
}

export function* shopCanceled(api, action) {
  try {
    const resPonse = yield call(api.shopCanceled, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.shopCanceledSuccess(data));
  } catch (error) {
    yield put(actions.shopCanceledFail(configResponseError(error)));
  }
}

export function* SubscriptionSaga() {
  yield all([
    yield takeLatest(actions.getPlans.type, getPlans, subscriptionRequest),
    yield takeLatest(actions.shopGetSubscription.type, shopGetSubscription, subscriptionRequest),
    yield takeLatest(actions.shopGetInvoices.type, shopGetInvoices, subscriptionRequest),
    yield takeLatest(actions.shopSubscriber.type, shopSubscriber, subscriptionRequest),
    yield takeLatest(actions.shopChanged.type, shopChanged, subscriptionRequest),
    yield takeLatest(actions.shopCanceled.type, shopCanceled, subscriptionRequest),
  ]);
}
