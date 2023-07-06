import { Users } from 'interface/Users.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface AuthState {
  loading: boolean;
  success: any;
  error: any;
  userInfor: Users | null;
  url: Array<any>;
  refreshToken: Users | null;
}

export const initialState: AuthState = {
  loading: false,
  success: false,
  error: false,
  userInfor: null,
  refreshToken: null,
  url: [],
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action) {
      state.loading = true;
    },
    signInSuccess(state, action) {
      state.loading = false;
      state.userInfor = action.payload.data;
    },
    signInFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    refreshToken(state) {
      state.loading = true;
    },
    refreshTokenSuccess(state, action) {
      state.loading = false;
      state.refreshToken = action.payload.data;
    },
    refreshTokenFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    signUp(state, action) {
      state.loading = true;
    },
    signUpSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    signUpFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    signOut(state) {
      state.loading = true;
    },
    signOutSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    signOutFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getUserById(state) {
      state.loading = true;
    },
    getUserByIdSuccess(state, action) {
      state.loading = false;
      state.userInfor = action.payload.data;
    },
    getUserByIdFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    forgotPassword(state, action) {
      state.loading = true;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    forgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resendForgotPassword(state, action) {
      state.loading = true;
    },
    resendForgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    resendForgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetForgotPassword(state, action) {
      state.loading = true;
    },
    resetForgotPasswordSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    resetForgotPasswordFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfile(state, action) {
      state.loading = true;
    },
    updateProfileSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    updateProfileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    uploadFile(state, action) {
      state.loading = true;
    },
    uploadFileSuccess(state, action) {
      state.loading = false;
      state.url = action.payload.data;
    },
    uploadFileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    removeFile(state, action) {
      state.loading = true;
    },
    removeFileSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    removeFileFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearUserInfo(state) {
      state.userInfor = null;
    },

    clearUrl(state) {
      state.url = [];
    },

    clearRefreshToKen(state) {
      state.refreshToken = null;
    },

    clearData(state) {
      state.success = false;
      state.error = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
