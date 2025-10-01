import React from "react";
import axiosInstance from "../../axiosInstance/axiosInstance";
import { mediaUrl } from "../../utils/mediaUrl";

export default function CustomSwiper({ events = [] }) {
  if (!Array.isArray(events) || events.length === 0) {
    return <div className="text-base-content/60">No upcoming events</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4">
        {events.map((ev) => {
          // ⬇️ rasm fieldlari: backend qaysi birini bersa — o‘sha olinadi
          const raw =
            ev.image || ev.cover || ev.banner || ev.photo || ev.thumbnail || ev.img || ev.picture;
          const src = mediaUrl(raw, axiosInstance?.defaults?.baseURL);

          return (
            <div
              key={ev.id || ev.slug || ev.title}
              className="min-w-[280px] w-[280px] h-[160px] rounded-xl border border-base-300 overflow-hidden bg-base-200"
              title={ev.title}
            >
              {src ? (
                <img
                  src={src}
                  alt={ev.title || "event"}
                  className="w-full h-full object-cover block"
                  loading="lazy"
                  onError={(e) => {
                    console.warn("Image failed:", src, ev);
                    e.currentTarget.replaceWith(
                      Object.assign(document.createElement("div"), {
                        className:
                          "w-full h-full flex items-center justify-center text-sm text-base-content/60",
                        innerText: "No image",
                      })
                    );
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
                  No image
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
