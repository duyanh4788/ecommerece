import { ShopState } from 'store/shops/shared/slice';
import { AuthState } from '../../auth/shared/slice';
import { SubscriptionState } from 'store/subscription/shared/slice';

export interface RootState {
  auth: AuthState;
  shop: ShopState;
  subscription: SubscriptionState;
}
