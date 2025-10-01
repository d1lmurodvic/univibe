import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TZ = "Asia/Tashkent";
const BASE_URL = "https://api.univibe.uz"; // backend uchun

const get = {
  id: (e, i) => e?.id || e?.slug || e?._id || `up-${i}`,
  title: (e) => e?.title || e?.name || "Event",
  img: (e) =>
    e?.img
      ? `${BASE_URL}${e.img}`
      : e?.cover || e?.banner || e?.photo || "",
  start: (e) =>
    e?.start_time || e?.starts_at || e?.start || e?.begin_at || e?.date,
  desc: (e) => e?.description || e?.text || "",
};

const toDate = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

function timeLeft(deadline) {
  if (!deadline) return "";
  const end = new Date(deadline);
  const diff = end - new Date();
  if (diff <= 0) return "Deadline passed";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
  return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
}

export default function UpcomingEvents({ events = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [registeredData, setRegisteredData] = useState({}); // qo‘shimcha state db uchun

  const [items, setItems] = useState(() =>
    (Array.isArray(events) ? events : []).map((e, i) => ({
      raw: e,
      id: get.id(e, i),
      title: get.title(e),
      img: get.img(e),
      desc: get.desc(e),
      startDate: toDate(get.start(e)),
      deadline: e?.registration_deadline,
      regCount: e?.registrations_count ?? 0,
    }))
  );

  if (!items.length) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-10 text-base-content/60 text-center">
        No upcoming events
      </div>
    );
  }

  const handleRegister = async (eventId) => {
    try {
      setLoadingId(eventId);

      const token = localStorage.getItem("token"); // tokenni localStorage dan olish
      if (!token) {
        toast.error("You must be logged in to register!");
        setLoadingId(null);
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/v1/events/register/`,
        { event_id: eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.registered) {
        toast.success("Registered successfully!");
        setItems((prev) =>
          prev.map((ev) =>
            ev.id === eventId ? { ...ev, regCount: (ev.regCount || 0) + 1 } : ev
          )
        );
        setRegisteredIds((prev) => [...prev, eventId]);
        setRegisteredData((prev) => ({
          ...prev,
          [eventId]: res.data, // backend qaytargan db ma’lumotlarini saqlash
        }));
      } else {
        toast.info("You are already registered.");
      }
    } catch (err) {
      console.error(err.response || err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((ev) => (
        <motion.div
          key={ev.id}
          whileHover={{ scale: 1.02 }}
          className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
        >
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden">
            {ev.img ? (
              <img
                src={ev.img}
                alt={ev.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-base-200 text-sm text-base-content/60">
                No image
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="space-y-3 p-4">
            <h3 className="line-clamp-2 text-base font-semibold text-base-content">
              {ev.title}
            </h3>

            <p className="text-sm text-base-content/70">
              Registered: <span className="font-medium">{ev.regCount}</span>
            </p>

            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                setExpandedId((prev) => (prev === ev.id ? null : ev.id))
              }
            >
              {expandedId === ev.id ? "Hide details" : "View details"}
            </button>

            {expandedId === ev.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2 border-t border-base-200 pt-3"
              >
                {ev.deadline && (
                  <p className="text-sm text-base-content/80">
                    Registration deadline:&nbsp;
                    <span className="font-semibold">
                      {new Date(ev.deadline).toLocaleString("uz-UZ", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: TZ,
                      })}
                    </span>
                    &nbsp;(
                    <span className="font-medium text-primary">
                      {timeLeft(ev.deadline)}
                    </span>
                    )
                  </p>
                )}

                {ev.desc && (
                  <p className="text-sm text-base-content/70">{ev.desc}</p>
                )}

                <button
                  onClick={() => handleRegister(ev.id)}
                  disabled={
                    loadingId === ev.id || registeredIds.includes(ev.id)
                  }
                  className={`btn btn-sm ${
                    registeredIds.includes(ev.id)
                      ? "btn-success"
                      : "btn-primary"
                  } mt-2`} 
                >
                  {loadingId === ev.id
                    ? "Registering..."
                    : registeredIds.includes(ev.id)
                    ? "Registered"
                    : "Register"}
                </button>

                {/* Qo‘shimcha: Registered db ni chiqarish */}
                {registeredData[ev.id] && (
                  <pre className="mt-2 rounded bg-base-200 p-2 text-xs text-left overflow-x-auto">
                    {JSON.stringify(registeredData[ev.id], null, 2)}
                  </pre>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
