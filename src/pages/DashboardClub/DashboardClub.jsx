import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL;

const DashboardClub = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrModal, setQrModal] = useState({ open: false, qrUrl: null });
  const [formData, setFormData] = useState({
    title: "",
    img: null,
    url: "",
    event_datetime: "",
    registration_deadline: "",
    has_promo: false,
    quantity_token: 0,
  });

  const token = localStorage.getItem("accessToken");

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/400x200";
    if (imgPath.startsWith("http")) return imgPath;
    return `${BASE_URL}${imgPath}`;
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/clubs/events/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveEvents(res.data?.active || []);
      setPendingEvents(res.data?.pending || []);
    } catch {
      toast.error("Failed to load events");
      setActiveEvents([]);
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/clubs/events/${eventId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully!");
      await fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", formData.title);

      if (formData.img) fd.append("img", formData.img);
      if (formData.url) fd.append("url", formData.url);

      if (formData.event_datetime) {
        const dt = new Date(formData.event_datetime);
        fd.append("event_datetime", dt.toISOString());
      }

      if (formData.registration_deadline) {
        const deadline = new Date(formData.registration_deadline)
          .toISOString()
          .split("T")[0];
        fd.append("registration_deadline", deadline);
      }

      if (formData.has_promo) {
        fd.append("has_promo", "true");
        fd.append("quantity_token", String(formData.quantity_token || 1));
      } else {
        fd.append("has_promo", "false");
      }

      const createRes = await axios.post(
        `${BASE_URL}/api/v1/clubs/events/create/`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Event created successfully!");
      await fetchEvents();
      document.getElementById("event_modal").close();

      if (createRes.data?.promo) {
        toast.info(`Promo code: ${createRes.data.promo}`);
      }
    } catch (err) {
      console.error("Create error:", err.response?.data || err.message);
      toast.error(
        err.response?.data?.detail ||
          "Failed to create event. Please try again."
      );
    }
  };

  const handleQrCode = async (eventId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/events/events/${eventId}/promo-qr/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.qr_code) {
        setQrModal({ open: true, qrUrl: `${BASE_URL}${res.data.qr_code}` });

        setTimeout(() => {
          document.getElementById("qr_modal").showModal();
        }, 50);
      } else {
        toast.error("No QR code found for this event");
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 404) {
        toast.error("This event has no promo QR");
      } else {
        toast.error("Failed to load QR code");
      }
    }
  };

  const EventSection = ({ title, events, borderColor }) => (
    <div className="mt-6">
      <p className="text-xl font-bold mb-4">{title}</p>
      {events.length === 0 ? (
        <p className="text-warning">No {title.toLowerCase()}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`relative bg-base-100 rounded-2xl shadow-lg border-t-4 ${borderColor} hover:shadow-2xl hover:scale-[1.02] transition-all`}
              >
                <figure className="rounded-t-2xl overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={getImageUrl(ev.img)}
                    alt={ev.title}
                    className="w-full h-48 object-cover"
                  />
                </figure>
                <div className="p-4 border-t flex items-center border-b-2 border-info rounded-b-2xl justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{ev.title}</h3>
                    <p className="text-sm text-base-content mt-1">
                      {ev.event_datetime
                        ? new Date(ev.event_datetime).toLocaleString()
                        : "No date"}
                    </p>
                    {ev.url && (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-primary hover:underline"
                      >
                        🔗 Event Link
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-success btn-sm"
                      onClick={() => handleQrCode(ev.id)}
                    >
                      QrCode
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(ev.id)}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto max-w-[95%] flex flex-col gap-6 py-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-info/80 flex sm:justify-center"
        >
          Dashboard
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
          >
            <IoMdTime /> Event history
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-success btn-sm sm:btn-md w-full sm:w-auto"
            onClick={() => document.getElementById("event_modal").showModal()}
          >
            + Add events
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      ) : (
        <>
          <EventSection
            title="Active Events"
            events={activeEvents}
            borderColor="border-success"
          />
          <EventSection
            title="Pending Events"
            events={pendingEvents}
            borderColor="border-info"
          />
        </>
      )}

      {/* ✅ QR Modal with animation */}
      <dialog id="qr_modal" className="modal modal-bottom sm:modal-middle">
        <AnimatePresence>
          {qrModal.open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="modal-box"
            >
              <h3 className="font-bold text-lg mb-4">Event QR Code</h3>
              {qrModal.qrUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={qrModal.qrUrl}
                  alt="QR Code"
                  className="mx-auto w-56 h-56 object-contain"
                />
              ) : (
                <p>No QR code found</p>
              )}
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setQrModal({ open: false, qrUrl: null });
                    document.getElementById("qr_modal").close();
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>

      {/* Add Event Modal */}
      <dialog id="event_modal" className="modal modal-bottom sm:modal-middle">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="modal-box w-full max-w-2xl"
        >
          <h3 className="font-bold text-lg mb-4">Create New Event</h3>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, img: e.target.files[0] })
              }
              className="file-input file-input-bordered w-full"
            />
            <input
              type="url"
              placeholder="Event URL"
              className="input input-bordered w-full"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              required
              value={formData.event_datetime}
              onChange={(e) =>
                setFormData({ ...formData, event_datetime: e.target.value })
              }
            />
            <input
              type="date"
              className="input input-bordered w-full"
              required
              value={formData.registration_deadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registration_deadline: e.target.value,
                })
              }
            />
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={formData.has_promo}
                onChange={(e) =>
                  setFormData({ ...formData, has_promo: e.target.checked })
                }
              />
              <span>Has promo?</span>
            </div>
            {formData.has_promo && (
              <input
                type="number"
                min="1"
                max="100"
                placeholder="Promo token quantity"
                className="input input-bordered w-full sm:col-span-2"
                value={formData.quantity_token}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity_token: parseInt(e.target.value) || 1,
                  })
                }
              />
            )}
            <div className="modal-action sm:col-span-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-success"
              >
                Create
              </motion.button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("event_modal").close()
                }
              >
                Close
              </button>
            </div>
          </form>
        </motion.div>
      </dialog>
    </motion.div>
  );
};

export default DashboardClub;
