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

export function* refreshToken(api, action) {
  try {
    const resPonse = yield call(api.refreshToken, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.refreshTokenSuccess(data));
  } catch (error) {
    yield put(actions.refreshTokenFail(configResponseError(error)));
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

export function* forgotPassword(api, action) {
  try {
    const resPonse = yield call(api.forgotPassword, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.forgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.forgotPasswordFail(configResponseError(error)));
  }
}

export function* resendForgotPassword(api, action) {
  try {
    const resPonse = yield call(api.resendForgotPassword, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.resendForgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resendForgotPasswordFail(configResponseError(error)));
  }
}

export function* resetForgotPassword(api, action) {
  try {
    const resPonse = yield call(api.resetForgotPassword, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.resetForgotPasswordSuccess(data));
  } catch (error) {
    yield put(actions.resetForgotPasswordFail(configResponseError(error)));
  }
}

export function* updateProfile(api, action) {
  try {
    const resPonse = yield call(api.updateProfile, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.updateProfileSuccess(data));
  } catch (error) {
    yield put(actions.updateProfileFail(configResponseError(error)));
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

export function* removeFile(api, action) {
  try {
    const resPonse = yield call(api.removeFile, action.payload);
    const data = yield configResponse(resPonse);
    yield put(actions.removeFileSuccess(data));
  } catch (error) {
    yield put(actions.removeFileFail(configResponseError(error)));
  }
}

export function* AuthSaga() {
  yield all([
    yield takeLatest(actions.signIn.type, signIn, authRequest),
    yield takeLatest(actions.refreshToken.type, refreshToken, authRequest),
    yield takeLatest(actions.signUp.type, signUp, authRequest),
    yield takeLatest(actions.signOut.type, signOut, authRequest),
    yield takeLatest(actions.getUserById.type, getUserById, authRequest),
    yield takeLatest(actions.forgotPassword.type, forgotPassword, authRequest),
    yield takeLatest(actions.resendForgotPassword.type, resendForgotPassword, authRequest),
    yield takeLatest(actions.resetForgotPassword.type, resetForgotPassword, authRequest),
    yield takeLatest(actions.updateProfile.type, updateProfile, authRequest),
    yield takeLatest(actions.uploadFile.type, uploadFile, authRequest),
    yield takeLatest(actions.removeFile.type, removeFile, authRequest),
  ]);
}
