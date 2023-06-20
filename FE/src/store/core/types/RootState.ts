import { AuthState } from '../../auth/shared/slice';
import { ChatAppState } from '../../chatApp/shared/slice';

export interface RootState {
  auth: AuthState;
  chatapp: ChatAppState;
}
