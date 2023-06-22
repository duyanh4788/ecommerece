import { LoaderFallBack } from 'commom/loading';
import { lazyLoad } from './loadable';

export const Home = lazyLoad(
  () => import('app'),
  module => module.Home,
  LoaderFallBack(),
);

export const SignIn = lazyLoad(
  () => import('app'),
  module => module.SignIn,
  LoaderFallBack(),
);

export const SignUp = lazyLoad(
  () => import('app'),
  module => module.SignUp,
  LoaderFallBack(),
);

export const Password = lazyLoad(
  () => import('app'),
  module => module.Password,
  LoaderFallBack(),
);
