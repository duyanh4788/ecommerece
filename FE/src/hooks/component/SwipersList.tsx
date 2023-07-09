import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, FreeMode, Navigation } from 'swiper';
interface Props {
  data: string[];
}

export const SwipersList = ({ data }: Props) => {
  SwiperCore.use([Autoplay]);
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={30}
      freeMode={true}
      loop={true}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay, FreeMode, Navigation]}
      className="mySwiper">
      {data.map((row, idx) => (
        <SwiperSlide key={idx}>
          <img src={row} alt={row} style={{ width: '100%', height: '360px' }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
