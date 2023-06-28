import { Invoices, PaypalBillingPlans, Subscription } from 'interface/Subscriptions.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface SubscriptionState {
  loading: boolean;
  success: any;
  error: any;
  subscription: Subscription | null;
  invoices: Invoices[];
  plans: PaypalBillingPlans[];
  links: string | null;
}

export const initialState: SubscriptionState = {
  loading: false,
  success: false,
  error: false,
  subscription: null,
  invoices: [],
  plans: [],
  links: null,
};

const AuthSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    getPlans(state) {
      state.loading = true;
    },
    getPlansSuccess(state, action) {
      state.loading = false;
      state.plans = action.payload.data;
    },
    getPlansFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    userGetSubscription(state) {
      state.loading = true;
    },
    userGetSubscriptionSuccess(state, action) {
      state.loading = false;
      state.subscription = action.payload.data;
    },
    userGetSubscriptionFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    userGetInvoices(state) {
      state.loading = true;
    },
    userGetInvoicesSuccess(state, action) {
      state.loading = false;
      state.invoices = action.payload.data;
    },
    userGetInvoicesFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    userSubscriber(state, action) {
      state.loading = true;
    },
    userSubscriberSuccess(state, action) {
      state.loading = false;
      state.links = action.payload.data;
    },
    userSubscriberFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    userChanged(state, action) {
      state.loading = true;
    },
    userChangedSuccess(state, action) {
      state.loading = false;
      state.links = action.payload.data;
    },
    userChangedFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    userCanceled(state, action) {
      state.loading = true;
    },
    userCanceledSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    userCanceledFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    clearSubscription(state) {
      state.subscription = null;
    },

    clearInvoices(state) {
      state.invoices = [];
    },

    clearLinks(state) {
      state.links = null;
    },

    clearData(state) {
      state.success = false;
      state.error = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = AuthSlice;
