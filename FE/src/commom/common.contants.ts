const DOMAIN = 'https://dv19cu1ukmppw.cloudfront.net/ecommerce';
export const NODEJS1 = DOMAIN + '/1688289445901.png';
export const NODEJS2 = DOMAIN + '/1688289500323.png';
export const REACT = DOMAIN + '/1688289511909.png';
export const GITHUB = DOMAIN + '/1688289499827.png';
export const CLOTHES = DOMAIN + '/1688289446712.png';
export const COSMETICS = DOMAIN + '/1688289446819.png';
export const ECOMMERCE = DOMAIN + '/1688289480171.png';
export const ELS = DOMAIN + '/1688289480462.png';
export const ELECTRONIC = DOMAIN + '/1688289480555.png';
export const TRIAL = DOMAIN + '/1688289480649.png';
export const FUNITURE = DOMAIN + '/1688289480758.png';
export const MAIL = DOMAIN + '/1688289500099.png';
export const LINKED = DOMAIN + '/1688289500196.png';
export const MYSQL = DOMAIN + '/1688289500497.png';
export const PHONE = DOMAIN + '/1688289511413.png';
export const PROFILE = DOMAIN + '/1688289511701.png';
export const BANNER_SHOP = DOMAIN + '/1688289446320.png';
export const RABITMQ = DOMAIN + '/1688289511790.png';
export const REDIS = DOMAIN + '/1688289512064.png';

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
  nodejs: NODEJS1,
  reactjs: REACT,
};

export const PAYPAL_LOGO =
  'https://www.paypalobjects.com/webstatic/mktg/Logo/AM_mc_vs_ms_ae_UK.png';

export const PAYPAL_BANNER =
  'https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/optimize/logo-center-other-options-white-shop-pp.png';

export const PAYPAL_SUBS = 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png';

export const FREE_TRIAL = TRIAL;

export const TITLE_ITEM =
  'Every month, System will reset resources after receiving payment from PayPal.';

export const TITLE_SUBS = 'Please subscribe and registed Shop.';

export const renderTitleResource = (num: number) => {
  return `In lifecycle, your can only register ${num} products in Shop`;
};

export const TITLE_WAITING = 'please waiting system sync transaction paymant with PayPal!';
export const TITLE_CHANGED =
  'Note: If you change your subscription, System is update the new plan with the cycle next payment, and the resource for you is reset with the new Plan after the system received payment from Paypal.';

export const BG_MAIN_2 = '#f5f5f5';
export const BG_MAIN_1 = '#d6cfc957';
export const CL_GR = '#919191';
export const CL_BL = '#212321';
export const CL_WT = '#ffffff';
export const CL_GRE = '#56ab2f';

export const FOOTER = [
  {
    key: 1,
    item: NODEJS2,
    valueArr: [
      { key: 1, item: 'NodeJS | ReactJS' },
      { key: 2, item: '© 2023 Designer By Anh Vu' },
    ],
  },
  {
    key: 2,
    item: 'PRODUCTS',
    valueArr: [
      { key: 1, item: 'Electronic', img: ELECTRONIC },
      { key: 2, item: 'Cosmetics', img: COSMETICS },
      { key: 3, item: 'Funiture', img: FUNITURE },
      { key: 4, item: 'Clothes', img: CLOTHES },
    ],
  },
  {
    key: 3,
    item: 'SYSTEM',
    valueArr: [
      { key: 1, item: 'elasticsearch', img: ELS },
      { key: 2, item: 'RabitMQ', img: RABITMQ },
      { key: 3, item: 'Redis', img: REDIS },
      { key: 4, item: 'MYSQL', img: MYSQL },
    ],
  },
  {
    key: 4,
    item: 'SOCIAL',
    valueArr: [
      { key: 1, item: 'Github', img: GITHUB, link: 'https://github.com/duyanh4788' },
      {
        key: 2,
        item: 'linked',
        img: LINKED,
        link: 'https://www.linkedin.com/in/v%C5%A9-duy-anh-a79124220/',
      },
      { key: 3, item: 'Gmail', img: MAIL, link: 'mailto:duyanh4788@gmail.com' },
      { key: 4, item: 'Phone', img: PHONE, link: 'tel:+0906068024' },
    ],
  },
];
