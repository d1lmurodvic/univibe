// src/components/TodayEvents/TodayEvents.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../axiosInstance/axiosInstance";

const TZ = "Asia/Tashkent";
const LOCALE = "uz-UZ";

// --- Helpers ---
const ensureAbsolute = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = axiosInstance?.defaults?.baseURL || "";
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = String(url).replace(/^\/+/, "");
  return `${cleanBase}/${cleanPath}`;
};

const getImages = (e) => {
  const fields = [
    "image","cover","banner","photo","thumbnail","img","picture",
    "image_url","file","url","images","photos","gallery","media","attachments"
  ];
  const urls = new Set();
  const push = (val) => {
    if (!val) return;
    if (typeof val === "string") urls.add(ensureAbsolute(val));
    else if (typeof val === "object") {
      const maybe = val.url || val.src || val.image || val.file || val.path;
      if (maybe) urls.add(ensureAbsolute(maybe));
    }
  };
  fields.forEach((k) => {
    const v = e?.[k];
    if (!v) return;
    Array.isArray(v) ? v.forEach(push) : push(v);
  });
  return Array.from(urls);
};

const get = {
  title: (e) => e.title || e.name || e.label || "Event",
  desc:  (e) => e.description || e.text || e.subtitle || "",
  location: (e) => e.location || e.place || e.address || "",
  club: (e) => e.club?.name || e.club_name || "",
  category: (e) => e.category?.name || e.category || "",
  price: (e) => e.price || e.cost || e.fee || "",
  capacity: (e) => e.capacity || e.limit || e.seats || e.quota || "",
  speakers: (e) => e.speakers || e.guests || e.presenters || e.lectors || [],
  start: (e) => e.start_time || e.starts_at || e.start || e.begin_at || e.date || e.datetime,
  end:   (e) => e.end_time   || e.ends_at   || e.end   || e.finish_at,
};

const parseDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const fmt = (d, opts={}) =>
  d?.toLocaleString(LOCALE, {
    timeZone: TZ,
    hour: "2-digit", minute: "2-digit",
    year: "numeric", month: "short", day: "2-digit",
    ...opts,
  }) || "";

const formatRange = (start, end) => {
  const s = parseDate(start);
  const e = parseDate(end);
  if (s && e) return `${fmt(s)} — ${e.toLocaleTimeString(LOCALE, { timeZone: TZ, hour: "2-digit", minute: "2-digit" })}`;
  if (s) return fmt(s);
  if (e) return fmt(e);
  return "";
};

// Qolgan maydonlarni avtomatik ko'rsatish (jadvalda)
const IMAGE_KEYS = new Set([
  "image","cover","banner","photo","thumbnail","img","picture","image_url","file","url",
  "images","photos","gallery","media","attachments",
]);
const EXCLUDE = new Set([
  "id","_id","slug",
  "title","name","label","description","text","subtitle",
  "location","place","address",
  "club","club_name","category","status","state","phase",
  "price","cost","fee","capacity","limit","seats","quota",
  "speakers","guests","presenters","lectors",
  "start_time","starts_at","start","begin_at","date","datetime",
  "end_time","ends_at","end","finish_at",
  ...IMAGE_KEYS,

  "registration_deadline",
  "is_registration_closed",
  "club_id",
]);

const stringifyValue = (v) => {
  if (v == null) return "";
  if (["string","number","boolean"].includes(typeof v)) return String(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    if (v.every(x => ["string","number","boolean"].includes(typeof x))) return v.join(", ");
    if (v.every(x => x && typeof x === "object" && (x.name || x.title))) return v.map(x => x.name || x.title).join(", ");
    return `Array(${v.length})`;
  }
  if (typeof v === "object") {
    if (v.name || v.title) return v.name || v.title;
    try { return JSON.stringify(v); } catch { return "Object"; }
  }
  return String(v);
};

const extractExtras = (obj) => {
  const out = [];
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    if (EXCLUDE.has(k)) continue;
    if (v == null) continue;
    out.push([k, stringifyValue(v)]);
  }
  return out;
};

export default function TodayEvents({ events = [], onOpen }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // ESC bilan yopish + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items = useMemo(() => {
    const arr = Array.isArray(events) ? events : [];
    const mapped = arr.map((e) => {
      const imgs = getImages(e);
      return {
        raw: e,
        id: e.id || e.slug || e._id || Math.random().toString(36).slice(2),
        title: get.title(e),
        desc: get.desc(e),
        location: get.location(e),
        club: get.club(e),
        category: get.category(e),
        price: get.price(e),
        capacity: get.capacity(e),
        speakers: get.speakers(e),
        start: get.start(e),
        end: get.end(e),
        startParsed: parseDate(get.start(e)),
        images: imgs,
        extras: extractExtras(e),
      };
    });

    return mapped.sort((a, b) => {
      if (a.startParsed && b.startParsed) return a.startParsed - b.startParsed;
      if (a.startParsed) return -1;
      if (b.startParsed) return 1;
      return 0;
    });
  }, [events]);

  if (!items.length) {
    return <div className="text-base-content/60">No active events today</div>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((ev) => (
          <div
            key={ev.id}
            className="rounded-xl border border-base-300 overflow-hidden bg-base-100 hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="w-full h-48 bg-base-200 relative">
              {ev.images?.[0] ? (
                <>
                  <img
                    src={ev.images[0]}
                    alt={ev.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {ev.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs bg-black/60 text-white">
                      +{ev.images.length - 1} more
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold">{ev.title}</h3>

              {(ev.start || ev.end) && (
                <div className="text-sm text-base-content/70">
                  {formatRange(ev.start, ev.end)}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {ev.location && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">{ev.location}</span>
                )}
                {ev.club && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Club: {ev.club}</span>
                )}
                {ev.category && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Category: {ev.category}</span>
                )}
                {ev.capacity && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Cap: {ev.capacity}</span>
                )}
                {ev.price && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Price: {ev.price}</span>
                )}
                {Array.isArray(ev.speakers) && ev.speakers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">
                    Speakers:{" "}
                    {ev.speakers
                      .map((s) => (typeof s === "string" ? s : s?.name || s?.title))
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>

              {ev.desc && <p className="text-sm text-base-content/80 line-clamp-3">{ev.desc}</p>}

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setActive(ev);
                  setOpen(true);
                  if (typeof onOpen === "function") onOpen(ev.raw);
                }}
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal with animation */}
      <AnimatePresence>
        {open && active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-3xl bg-base-100 rounded-xl border border-base-300 shadow-xl"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-base-300 flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold">{active.title}</h3>
                <button className="btn btn-sm btn-ghost" onClick={() => setOpen(false)}>✕</button>
              </div>

              {/* Body */}
              <div className="p-4 max-h-[70vh] overflow-auto space-y-4">
                {/* Large image */}
                <AnimatePresence mode="popLayout">
                  {active.images?.[0] && (
                    <motion.div
                      className="w-full h-56 bg-base-200 rounded-lg overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <img
                        src={active.images[0]}
                        alt={active.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Thumbs */}
                {active.images && active.images.length > 1 && (
                  <motion.div
                    className="flex gap-2 overflow-x-auto"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {active.images.slice(1).map((src, i) => (
                      <motion.img
                        key={src + i}
                        src={src}
                        alt={`thumb-${i}`}
                        className="w-20 h-14 object-cover rounded border border-base-300"
                        loading="lazy"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.03 * i }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Chips + time */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {(active.start || active.end) && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">
                      {formatRange(active.start, active.end)}
                    </span>
                  )}
                  {active.location && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">{active.location}</span>
                  )}
                  {active.club && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Club: {active.club}</span>
                  )}
                  {active.category && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Category: {active.category}</span>
                  )}
                  {active.capacity && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Cap: {active.capacity}</span>
                  )}
                  {active.price && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">Price: {active.price}</span>
                  )}
                  {Array.isArray(active.speakers) && active.speakers.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs">
                      Speakers:{" "}
                      {active.speakers
                        .map((s) => (typeof s === "string" ? s : s?.name || s?.title))
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </motion.div>

                {/* Description */}
                {active.desc && (
                  <motion.p
                    className="text-sm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {active.desc}
                  </motion.p>
                )}

                {/* All extra fields table */}
                {active.extras?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h4 className="text-sm font-medium mb-1">All fields</h4>
                    <table className="w-full text-sm">
                      <tbody>
                        {active.extras.map(([k, v]) => (
                          <tr key={k}>
                            <td className="py-1 pr-2 text-base-content/60 align-top whitespace-nowrap">{k}</td>
                            <td className="py-1 break-words">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-base-300 flex justify-end">
                <button className="btn btn-ghost btn-sm mr-2" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
