import { useInjectReducer, useInjectSaga } from '../@reduxjs/redux-injectors';
import * as AuthSlice from 'store/auth/shared/slice';
import { AuthSaga } from 'store/auth/shared/saga';
import * as SubscriptionSlice from 'store/subscription/shared/slice';
import { SubscriptionSaga } from 'store/subscription/shared/saga';
import * as ShopSlice from 'store/shops/shared/slice';
import { ShopSaga } from 'store/shops/shared/saga';

export const useInjectSlicesAndSagas = () => {
  useInjectReducer({
    key: AuthSlice.sliceKey,
    reducer: AuthSlice.reducer,
  });
  useInjectSaga({
    key: AuthSlice.sliceKey,
    saga: AuthSaga,
  });

  useInjectReducer({
    key: SubscriptionSlice.sliceKey,
    reducer: SubscriptionSlice.reducer,
  });
  useInjectSaga({
    key: SubscriptionSlice.sliceKey,
    saga: SubscriptionSaga,
  });

  useInjectReducer({
    key: ShopSlice.sliceKey,
    reducer: ShopSlice.reducer,
  });
  useInjectSaga({
    key: ShopSlice.sliceKey,
    saga: ShopSaga,
  });
  return;
};
