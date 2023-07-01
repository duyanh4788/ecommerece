import logo from 'images/logo.png';
import react from 'images/react.png';
import github from 'images/github.png';
import gmail from 'images/gmail.png';
import linkedin from 'images/linkedin.png';
import phone from 'images/phone.png';
import clothes from 'images/clothes.png';
import electronic from 'images/electronic.png';
import funiture from 'images/funiture.png';
import cosmetics from 'images/cosmetics.png';
import elacticsearch from 'images/elacticsearch.png';
import rabitmq from 'images/rabitmq.png';
import redis from 'images/redis.png';
import mysql from 'images/mysql.png';
import bannernode from 'images/bannernode.png';
import free_trial from 'images/free.png';

export const TOKEN_EXPRIED = 'token expired, please login again.';

export const PATH_PARAMS = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  PASSW: '/password',
  PROFILE: '/profile',
  SUBSCRIBER: '/subscriber',
};

export const TYPE_RESET_PW = {
  FORGOT: 'FORGOT',
  RESEND: 'RESEND',
  RESET: 'RESET',
};

export const FOOTER_INFOR = {
  nodejs: bannernode,
  reactjs: react,
};

export const PAYPAL_LOGO =
  'https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_ms_ae_UK.png';

export const PAYPAL_BANNER =
  'https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/optimize/logo-center-other-options-white-shop-pp.png';

export const PAYPAL_SUBS = 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png';

export const FREE_TRIAL = free_trial;

export const TITLE_ITEM =
  'Every month, System will reset resources after receiving payment from PayPal.';

export const FOOTER = [
  {
    key: 1,
    item: logo,
    valueArr: [
      { key: 1, item: 'NodeJS | ReactJS' },
      { key: 2, item: '© 2023 Designer By Anh Vu' },
    ],
  },
  {
    key: 2,
    item: 'PRODUCTS',
    valueArr: [
      { key: 1, item: 'Electronic', img: electronic },
      { key: 2, item: 'Cosmetics', img: cosmetics },
      { key: 3, item: 'Funiture', img: funiture },
      { key: 4, item: 'Clothes', img: clothes },
    ],
  },
  {
    key: 3,
    item: 'SYSTEM',
    valueArr: [
      { key: 1, item: 'elasticsearch', img: elacticsearch },
      { key: 2, item: 'RabitMQ', img: rabitmq },
      { key: 3, item: 'Redis', img: redis },
      { key: 4, item: 'MYSQL', img: mysql },
    ],
  },
  {
    key: 4,
    item: 'SOCIAL',
    valueArr: [
      { key: 1, item: 'Github', img: github, link: 'https://github.com/duyanh4788' },
      {
        key: 2,
        item: 'linked',
        img: linkedin,
        link: 'https://www.linkedin.com/in/v%C5%A9-duy-anh-a79124220/',
      },
      { key: 3, item: 'Gmail', img: gmail, link: 'mailto:duyanh4788@gmail.com' },
      { key: 4, item: 'Phone', img: phone, link: 'tel:+0906068024' },
    ],
  },
];
