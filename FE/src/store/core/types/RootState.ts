import { ShopState } from 'store/shops/shared/slice';
import { AuthState } from '../../auth/shared/slice';
import { SubscriptionState } from 'store/subscription/shared/slice';
import { ItemState } from 'store/items/shared/slice';
import { GuestState } from 'store/guest/shared/slice';

export interface RootState {
  auth: AuthState;
  shop: ShopState;
  item: ItemState;
  subscription: SubscriptionState;
  guest: GuestState;
}
