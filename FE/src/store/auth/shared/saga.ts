import { call, put, takeLatest, all } from 'redux-saga/effects';
import { actions } from './slice';
import { AuthHttp } from '../service/auth.http';
import { configResponse, configResponseError } from 'services/request';

const authRequest = new AuthHttp();

export function* sigInUser(api, action) {
  const resPonse = yield call(api.signInUser, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.sigInUserSuccess(data));
  } catch (error) {
    yield put(actions.sigInUserFail(configResponseError(error)));
  }
}

export function* sigInUserWithCode(api, action) {
  const resPonse = yield call(api.sigInUserWithCode, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.sigInUserWithCodeSuccess(data));
  } catch (error) {
    yield put(actions.sigInUserWithCodeFail(configResponseError(error)));
  }
}

export function* signUpUser(api, action) {
  const resPonse = yield call(api.signUpUser, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpUserSuccess(data));
  } catch (error) {
    yield put(actions.signUpUserFail(configResponseError(error)));
  }
}

export function* activeAuthCode(api, action) {
  const resPonse = yield call(api.activeAuthCode, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.activeAuthCodeSuccess(data));
  } catch (error) {
    yield put(actions.activeAuthCodeFail(configResponseError(error)));
  }
}

export function* forgotPassword(api, action) {
  const resPonse = yield call(api.forgotPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.forgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.forgotPasswordFail(configResponseError(error)));
  }
}

export function* resendOrderForgotPassword(api, action) {
  const resPonse = yield call(api.resendOrderForgotPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.resendOrderForgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resendOrderForgotPasswordFail(configResponseError(error)));
  }
}

export function* resetPassword(api, action) {
  const resPonse = yield call(api.resetPassword, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.resetPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resetPasswordFail(configResponseError(error)));
  }
}

export function* signUpWithFB(api, action) {
  const resPonse = yield call(api.signUpWithFB, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpWithFBSuccess(data));
  } catch (error) {
    yield put(actions.signUpWithFBFail(configResponseError(error)));
  }
}

export function* signUpWithGG(api, action) {
  const resPonse = yield call(api.signUpWithGG, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.signUpWithGGSuccess(data));
  } catch (error) {
    yield put(actions.signUpWithGGFail(configResponseError(error)));
  }
}

export function* getUserById(api, action) {
  const resPonse = yield call(api.getUserById, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.getUserByIdSuccess(data));
  } catch (error) {
    yield put(actions.getUserByIdFail(configResponseError(error)));
  }
}

export function* changeStatusOnline(api, action) {
  const resPonse = yield call(api.changeStatusOnline, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.changeStatusOnlineSuccess(data));
  } catch (error) {
    yield put(actions.changeStatusOnlineFail(configResponseError(error)));
  }
}

export function* updateInfo(api, action) {
  const resPonse = yield call(api.updateInfo, action.payload);
  try {
    const data = yield configResponse(resPonse);
    yield put(actions.updateInfoSuccess(data));
  } catch (error) {
    yield put(actions.updateInfoFail(configResponseError(error)));
  }
}

export function* AuthSaga() {
  yield all([
    yield takeLatest(actions.sigInUser.type, sigInUser, authRequest),
    yield takeLatest(actions.sigInUserWithCode.type, sigInUserWithCode, authRequest),
    yield takeLatest(actions.signUpUser.type, signUpUser, authRequest),
    yield takeLatest(actions.activeAuthCode.type, activeAuthCode, authRequest),
    yield takeLatest(actions.forgotPassword.type, forgotPassword, authRequest),
    yield takeLatest(
      actions.resendOrderForgotPassword.type,
      resendOrderForgotPassword,
      authRequest,
    ),
    yield takeLatest(actions.resetPassword.type, resetPassword, authRequest),
    yield takeLatest(actions.signUpWithFB.type, signUpWithFB, authRequest),
    yield takeLatest(actions.signUpWithGG.type, signUpWithGG, authRequest),
    yield takeLatest(actions.getUserById.type, getUserById, authRequest),
    yield takeLatest(actions.updateInfo.type, updateInfo, authRequest),
    yield takeLatest(actions.changeStatusOnline.type, changeStatusOnline, authRequest),
  ]);
}
