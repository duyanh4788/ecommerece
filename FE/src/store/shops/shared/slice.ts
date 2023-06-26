import { Products, Shops } from 'interface/Shops.model';
import { createSlice } from 'store/core/@reduxjs/toolkit';

export interface ShopState {
  loading: boolean;
  success: any;
  error: any;
  shops: Shops[];
  shopInfor: Shops | null;
  prodcuts: Products[];
  url: Array<any>;
}

export const initialState: ShopState = {
  loading: false,
  success: false,
  error: false,
  shopInfor: null,
  shops: [],
  prodcuts: [],
  url: [],
};

const ShopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    registedShop(state, action) {
      state.loading = true;
    },
    registedShopSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    registedShopFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    updatedShop(state, action) {
      state.loading = true;
    },
    updatedShopSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    updatedShopFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    deletedShop(state) {
      state.loading = true;
    },
    deletedShopSuccess(state, action) {
      state.loading = false;
      state.success = action.payload.data;
    },
    deletedShopFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    getListsShop(state) {
      state.loading = true;
    },
    getListsShopSuccess(state, action) {
      state.loading = false;
      state.shops = action.payload.data;
    },
    getListsShopFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    getShopById(state, action) {
      state.loading = true;
    },
    getShopByIdSuccess(state, action) {
      state.loading = false;
      state.shopInfor = action.payload.data;
    },
    getShopByIdFail(state, action) {
      state.loading = false;
      state.error = action.payload.data;
    },

    prodGetLists(state) {
      state.loading = true;
    },
    prodGetListsSuccess(state, action) {
      state.loading = false;
      state.prodcuts = action.payload.data;
    },
    prodGetListsFail(state, action) {
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

    clearShops(state) {
      state.shops = [];
    },

    clearShop(state) {
      state.shopInfor = null;
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

export const { actions, reducer, name: sliceKey } = ShopSlice;
