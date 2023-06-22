import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { AuthHttp } from '../service/auth.http';
import { configResponse, configResponseError } from 'services/request';

const authRequest = new AuthHttp();

export function* signIn(api, action) {
  try {
    const resPonse = yield call(api.signIn, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.signInSuccess(data));
  } catch (error) {
    yield put(actions.signInFail(configResponseError(error)));
  }
}

export function* signUp(api, action) {
  try {
    const resPonse = yield call(api.signUp, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.signUpSuccess(data));
  } catch (error) {
    yield put(actions.signUpFail(configResponseError(error)));
  }
}

export function* signOut(api, action) {
  try {
    const resPonse = yield call(api.signOut, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.signOutSuccess(data));
  } catch (error) {
    yield put(actions.signOutFail(configResponseError(error)));
  }
}

export function* getUserById(api, action) {
  try {
    const resPonse = yield call(api.getUserById, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.getUserByIdSuccess(data));
  } catch (error) {
    yield put(actions.getUserByIdFail(configResponseError(error)));
  }
}

export function* AuthSaga() {
  yield all([
    yield takeLatest(actions.signIn.type, signIn, authRequest),
    yield takeLatest(actions.signUp.type, signUp, authRequest),
    yield takeLatest(actions.signOut.type, signOut, authRequest),
    yield takeLatest(actions.getUserById.type, getUserById, authRequest),
  ]);
}
