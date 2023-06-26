import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

export const SwipersList = ({ data }) => {
  SwiperCore.use([Autoplay]);
  return (
    <Swiper
      slidesPerView={1}
      loop
      rewind
      autoplay={{
        delay: 3000,
      }}
      speed={1200}
      longSwipesMs={300}>
      {data.map((row, idx) => (
        <SwiperSlide key={idx}>
          <img src={row} alt={row} style={{ width: '100%', height: '360px' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
