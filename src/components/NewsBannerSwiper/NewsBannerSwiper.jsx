// src/components/NewsBannerSwiper/NewsBannerSwiper.jsx
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ensureAbsolute = (url) =>
  !url ? "" : /^https?:\/\//i.test(url) ? url : `https://api.univibe.uz/${String(url).replace(/^\/+/, "")}`;

const pickImage = (item) =>
  item?.image ||
  item?.banner ||
  item?.photo ||
  item?.thumbnail ||
  item?.img ||
  item?.picture ||
  item?.cover ||
  item?.file ||
  item?.image_url;

export default function NewsBannerSwiper({ banners = [], height = 350 }) {
  const slides = useMemo(
    () =>
      (Array.isArray(banners) ? banners : [])
        .map((b) => {
          const image = ensureAbsolute(pickImage(b));
          return image
            ? {
                id: b.id || b.slug || b.title || JSON.stringify(b),
                image,
                title: b.title || b.name || "",
                description: b.description || b.text || "",
                ctaText: b.cta_text || b.button || b.link_text || "",
                ctaUrl: b.cta_url || b.url || "",
              }
            : null;
        })
        .filter(Boolean),
    [banners]
  );

  if (!slides.length) return <div className="text-base-content/60">No banners</div>;

  return (
    <div className="relative w-full mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        style={{ "--swiper-navigation-color": "currentColor" }}
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div
              className="relative w-full rounded-xl overflow-hidden border border-base-300 bg-base-200"
              style={{ height: `${height}px` }} // ❗ fixed height
            >
              <img
                src={s.image}
                alt={s.title || "banner"}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* dark gradient bottom overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

              { (s.title || s.description) && (
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 text-white">
                  {s.title && (
                    <h3 className="text-lg md:text-2xl font-semibold drop-shadow">{s.title}</h3>
                  )}
                  {s.description && (
                    <p className="mt-1 text-sm md:text-base opacity-90 line-clamp-2">
                      {s.description}
                    </p>
                  )}
                  {s.ctaUrl && (
                    <a
                      href={s.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-3 px-3 py-2 rounded-lg bg-white/90 text-gray-900 hover:bg-white transition"
                    >
                      {s.ctaText || "Learn more"}
                    </a>
                  )}
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
