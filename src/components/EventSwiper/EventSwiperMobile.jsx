// components/EventSwiper/EventSwiperMobile.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import EventCard from '../EventCard/EventCard';

const EventSwiperMobile = ({ events }) => {
  return (
    <div className="flex justify-center">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        className="w-full"
      >
        {events.length > 0 ? (
          events.map((event, index) => (
            <SwiperSlide key={index} className="w-full pb-5">
              <EventCard activeEvents={[event]} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="w-full">
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-base-content text-center">No events available at the moment.</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default EventSwiperMobile;
