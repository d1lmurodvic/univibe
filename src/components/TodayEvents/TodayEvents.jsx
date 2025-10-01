// src/components/TodayEvents/TodayEvents.jsx
import React, { useMemo } from "react";

const TZ = "Asia/Tashkent";
const LOCALE = "uz-UZ";
const BASE_URL = "https://api.univibe.uz";

const parseDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const fmt = (d) =>
  d?.toLocaleString(LOCALE, {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }) || "";

export default function TodayEvents({ events = [] }) {
  const items = useMemo(() => {
    const arr = Array.isArray(events) ? events : [];
    return arr.map((e) => ({
      id: e.id || e._id || Math.random().toString(36).slice(2),
      title: e.title || "Event",
      datetime: e.event_datetime || null,
      url: e.url || null,

      // ✅ Club name & logo
      club: e.club?.name || e.club_id?.name || e.club_name || "Club",
      clubImg: e.club?.image
        ? `${BASE_URL}${e.club.image}`
        : e.club_id?.logo
        ? `${BASE_URL}${e.club_id.logo}`
        : "/default-user.png",

      // ✅ Event main image
      img: e.img
        ? `${BASE_URL}${e.img}`
        : e.image
        ? `${BASE_URL}${e.image}`
        : null,
    }));
  }, [events]);

  if (!items.length) {
    return <div className="text-base-content/60">No active events today</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((ev) => (
        <div
          key={ev.id}
          className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden"
        >
          {/* Header: Club/User */}
          <div className="flex items-center gap-3 p-3">
            <img
              src={ev.clubImg}
              alt={ev.club}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{ev.club}</span>
          </div>

          {/* Main Event Image */}
          <div className="w-full aspect-square bg-base-200 relative">
            {ev.img ? (
              <img
                src={ev.img}
                alt={ev.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
                No image
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-base">{ev.title}</h3>

            {ev.datetime && (
              <p className="text-sm text-base-content/70">
                {fmt(parseDate(ev.datetime))}
              </p>
            )}

            {ev.url && (
              <a
                href={ev.url}
                className="text-primary text-sm underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                More info
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
