import * as AuthSelector from 'store/auth/shared/selectors';
import { useSelector } from 'react-redux';

export const ExtendSelectors = () => {
  const refreshToken = useSelector(AuthSelector.selectRefreshToken);
  return { refreshToken };
};
