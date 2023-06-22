import { Users } from 'interface/Users.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface AuthState {
  loading: boolean;
  success: any;
  error: any;
  userInfor: Users | null;
}

export const initialState: AuthState = {
  loading: false,
  success: false,
  error: false,
  userInfor: null,
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

    clearUserInfo(state) {
      state.userInfor = null;
    },

    clearData(state) {
      state.success = false;
      state.error = false;
      state.userInfor = null;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
