// CustomSwiperMobile.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

const CustomSwiperMobile = ({ events }) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      modules={[Pagination, Autoplay]}
      className="w-[300px] h-[120px]"
    >
      {events.length > 0 ? (
        events.map((event, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className="h-full bg-primary p-4 rounded-xl shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2 truncate">{event.title}</h3>
              <p className="text-sm text-base-content line-clamp-3">{event.description}</p>
            </motion.div>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-base-content text-center">No news available</p>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default CustomSwiperMobile;
