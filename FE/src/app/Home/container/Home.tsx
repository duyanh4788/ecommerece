import React from 'react';

export const Home = () => {
  const data = [
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/bannernode.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/banner_shop.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/ecommerce.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/elacticsearch.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/free.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/github.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/gmail.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/linkedin.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/logo.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/mysql.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/phone.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/profile.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/rabitmq.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/react.png',
    'https://dv19cu1ukmppw.cloudfront.net/ecommerce/redis.png',
  ];
  return (
    <div>
      {data.map((item, idx) => (
        <img key={idx} src={item} alt={item} width={'100px'} height={'100px'} />
      ))}
    </div>
  );
};
