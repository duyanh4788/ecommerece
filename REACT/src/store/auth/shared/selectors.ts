import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/core/types';
import { initialState } from './slice';

const selectAuth = (state: RootState) => state?.auth || initialState;

export const selectLoading = createSelector([selectAuth], state => state.loading);

export const selectSuccess = createSelector([selectAuth], state => state.success);

export const selectError = createSelector([selectAuth], state => state.error);

export const selectUserInfor = createSelector([selectAuth], state => state.userInfor);

export const selectRefreshToken = createSelector([selectAuth], state => state.refreshToken);

export const selectUrl = createSelector([selectAuth], state => state.url);
