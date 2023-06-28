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

export function* userGetSubscription(api, action) {
  try {
    const resPonse = yield call(api.userGetSubscription, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.userGetSubscriptionSuccess(data));
  } catch (error) {
    yield put(actions.userGetSubscriptionFail(configResponseError(error)));
  }
}

export function* userGetInvoices(api, action) {
  try {
    const resPonse = yield call(api.userGetInvoices, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.userGetInvoicesSuccess(data));
  } catch (error) {
    yield put(actions.userGetInvoicesFail(configResponseError(error)));
  }
}

export function* userSubscriber(api, action) {
  try {
    const resPonse = yield call(api.userSubscriber, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.userSubscriberSuccess(data));
  } catch (error) {
    yield put(actions.userSubscriberFail(configResponseError(error)));
  }
}

export function* userChanged(api, action) {
  try {
    const resPonse = yield call(api.userChanged, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.userChangedSuccess(data));
  } catch (error) {
    yield put(actions.userChangedFail(configResponseError(error)));
  }
}

export function* userCanceled(api, action) {
  try {
    const resPonse = yield call(api.userCanceled, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.userCanceledSuccess(data));
  } catch (error) {
    yield put(actions.userCanceledFail(configResponseError(error)));
  }
}

export function* SubscriptionSaga() {
  yield all([
    yield takeLatest(actions.getPlans.type, getPlans, subscriptionRequest),
    yield takeLatest(actions.userGetSubscription.type, userGetSubscription, subscriptionRequest),
    yield takeLatest(actions.userGetInvoices.type, userGetInvoices, subscriptionRequest),
    yield takeLatest(actions.userSubscriber.type, userSubscriber, subscriptionRequest),
    yield takeLatest(actions.userChanged.type, userChanged, subscriptionRequest),
    yield takeLatest(actions.userCanceled.type, userCanceled, subscriptionRequest),
  ]);
}
