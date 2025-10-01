import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CustomSwiper = ({ events }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full max-w-6xl mx-auto overflow-hidden px-2 relative">
      <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 z-10">
        <button
          ref={prevRef}
          className="bg-base-300 cursor-pointer hover:bg-base-100 rounded-r-full p-2 shadow"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
        <button
          ref={nextRef}
          className="bg-base-300 cursor-pointer hover:bg-base-100 rounded-l-full p-2 shadow"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Свайпер */}
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 1 },
        }}
        pagination={{
          el: '.custom-pagination',
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          // нужно, чтобы ref работал при инициализации
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        modules={[Pagination, Autoplay, Navigation]}
        className="w-full h-60"
      >
        {events.length > 0 ? (
          events.map((event, index) => (
            <SwiperSlide key={index} className="w-full">
              <motion.div
                className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-base-200 to-base-300 rounded-lg p-4 w-full max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                // style={{backgroundImage: url(`${event.banner || 'default-image.jpg'}`), backgroundSize: 'cover', backgroundPosition: 'center'}}
              >
                <h3 className="text-xl font-medium text-center w-full truncate">
                  {event.title || 'Untitled Event'}
                </h3>
                <p className="text-base-content mt-2 text-center w-full line-clamp-3">
                  {event.description || 'No description available.'}
                </p>
              </motion.div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="w-full">
            <div className="flex flex-col items-center justify-center h-full p-4 w-full max-w-sm mx-auto">
              <p className="text-base-content text-center">No news available at the moment.</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <div className="custom-pagination flex justify-center mt-4 gap-2"></div>
    </div>
  );
};

export default CustomSwiper;