import { PATH_PARAMS } from 'commom/common.contants';
import { FunctionComponent } from 'react';
import * as Router from 'router/lazyRouting';

export interface AppRoute {
  key: number;
  path: string;
  title: string;
  Component: FunctionComponent;
  displayOrder?: number;
}

export const AppRouting: AppRoute[] = [
  { key: 1, path: PATH_PARAMS.HOME, title: 'Home Ecommerce', Component: Router.Home },
  { key: 2, path: PATH_PARAMS.SIGNUP, title: 'Sign up Ecommerce', Component: Router.SignUp },
  { key: 3, path: PATH_PARAMS.SIGNIN, title: 'Sign in Ecommerce', Component: Router.SignIn },
  { key: 4, path: PATH_PARAMS.PASSW, title: 'Password Ecommerce', Component: Router.Password },
  { key: 5, path: PATH_PARAMS.PROFILE, title: 'Profile Ecommerce', Component: Router.Profile },
  {
    key: 6,
    path: PATH_PARAMS.SUBSCRIBER,
    title: 'Subscriber Ecommerce',
    Component: Router.Subscriber,
  },
  { key: 7, path: '*', title: '404 Notfound', Component: Router.NotFound },
];
