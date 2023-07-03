import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
interface Props {
  data: string[];
}

export const SwipersList = ({ data }: Props) => {
  SwiperCore.use([Autoplay]);
  return (
    <Swiper
      loop={true}
      slidesPerView={'auto'}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper">
      {data.map((row, idx) => (
        <SwiperSlide key={idx}>
          <img src={row} alt={row} style={{ width: '100%', height: '360px' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
