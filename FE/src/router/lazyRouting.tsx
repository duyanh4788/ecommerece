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

export const Profile = lazyLoad(
  () => import('app'),
  module => module.Profile,
  LoaderFallBack(),
);

export const NotFound = lazyLoad(
  () => import('app'),
  module => module.NotFound,
  LoaderFallBack(),
);

export const Subscriber = lazyLoad(
  () => import('app'),
  module => module.Subscriber,
  LoaderFallBack(),
);
