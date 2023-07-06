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
      state.error = action.payload;
    },

    shopGetSubscription(state, action) {
      state.loading = true;
    },
    shopGetSubscriptionSuccess(state, action) {
      state.loading = false;
      state.subscription = action.payload.data;
    },
    shopGetSubscriptionFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    shopGetInvoices(state, action) {
      state.loading = true;
    },
    shopGetInvoicesSuccess(state, action) {
      state.loading = false;
      state.invoices = action.payload.data;
    },
    shopGetInvoicesFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    shopSubscriber(state, action) {
      state.loading = true;
    },
    shopSubscriberSuccess(state, action) {
      state.loading = false;
      state.links = action.payload.data;
    },
    shopSubscriberFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    shopChanged(state, action) {
      state.loading = true;
    },
    shopChangedSuccess(state, action) {
      state.loading = false;
      state.links = action.payload.data;
    },
    shopChangedFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    shopCanceled(state, action) {
      state.loading = true;
    },
    shopCanceledSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    shopCanceledFail(state, action) {
      state.loading = false;
      state.error = action.payload;
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
