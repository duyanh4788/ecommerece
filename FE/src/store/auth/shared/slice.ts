import { Users } from 'interface/Users.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface AuthState {
  loading: boolean;
  success: any;
  error: any;
  userInfor: Users | null;
  url: Array<any>;
}

export const initialState: AuthState = {
  loading: false,
  success: false,
  error: false,
  userInfor: null,
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
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
      state.error = action.payload.data;
    },

    clearUserInfo(state) {
      state.userInfor = null;
    },

    clearUrl(state) {
      state.url = [];
    },

    clearData(state) {
      state.success = false;
      state.error = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
