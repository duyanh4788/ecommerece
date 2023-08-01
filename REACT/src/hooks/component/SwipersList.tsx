import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper';
interface Props {
  data: string[];
  type?: boolean;
}

export const SwipersList = ({ data, type = false }: Props) => {
  SwiperCore.use([Autoplay]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  if (type) {
    return (
      <React.Fragment>
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2">
          {data.map((row, idx) => (
            <SwiperSlide key={idx}>
              <img src={row} alt={row} style={{ width: '100%', height: '360px' }} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper as any}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper3">
          {data.map((row, idx) => (
            <SwiperSlide key={idx}>
              <img src={row} alt={row} style={{ width: '100%', height: '100px' }} />
            </SwiperSlide>
          ))}
        </Swiper>
      </React.Fragment>
    );
  }
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
