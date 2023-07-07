import React from 'react';

export const Home = () => {
  const data = [
    'https://dv19cu1ukmppw.cloudfront.net/img/bannernode.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/banner_shop.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/ecommerce.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/elacticsearch.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/free.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/github.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/gmail.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/linkedin.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/logo.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/mysql.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/phone.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/profile.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/rabitmq.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/react.png',
    'https://dv19cu1ukmppw.cloudfront.net/img/redis.png',
  ];
  return (
    <div>
      {data.map((item, idx) => (
        <img key={idx} src={item} alt={item} width={'100px'} height={'100px'} />
      ))}
    </div>
  );
};
