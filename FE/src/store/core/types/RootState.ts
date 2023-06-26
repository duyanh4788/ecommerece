import { ShopState } from 'store/shops/shared/slice';
import { AuthState } from '../../auth/shared/slice';

export interface RootState {
  auth: AuthState;
  shop: ShopState;
}
