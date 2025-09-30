import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://api.univibe.uz";

const DashboardClub = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // === Fetch Events ===
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/clubs/events/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("RAW EVENTS RESPONSE:", JSON.stringify(res.data, null, 2));

      setActiveEvents(res.data?.active || []);
      setPendingEvents(res.data?.pending || []);
    } catch (err) {
      console.error("Fetch events error:", err.response?.data || err.message);
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

  // === Delete Event ===
  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${BASE_URL}/api/v1/clubs/events/${eventId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully!");
      await fetchEvents();
    } catch (err) {
      console.error("Delete event error:", err.response?.data || err.message);
      toast.error("Failed to delete event");
    }
  };

  // === Create Event ===
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
        fd.append("quantity_token", String(formData.quantity_token));
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

      console.log("Created event:", createRes.data);

      toast.success("Event created successfully!");
      await fetchEvents();
      document.getElementById("event_modal").close();
    } catch (err) {
      console.error("Create event error:", err.response?.data || err.message);
      toast.error("Failed to create event. Please try again.");
    }
  };

  const EventSection = ({ title, events, borderColor }) => (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {events.length === 0 ? (
        <p className="text-base-300">No {title.toLowerCase()}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`relative bg-base-100 rounded-2xl shadow-lg border-t-4 ${borderColor} hover:shadow-2xl hover:scale-[1.02] transition-all`}
            >
              <figure className="rounded-t-2xl overflow-hidden">
                <img
                  src={getImageUrl(ev.img)}
                  alt={ev.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
              </figure>
              <div className="p-4 border-t flex items-center justify-between">
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
                <button
                  className="btn btn-error btn-sm ml-2"
                  onClick={() => handleDelete(ev.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto max-w-[95%] flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-info/80">Dashboard</p>
        <div className="flex gap-3">
          <button className="btn btn-primary">
            <IoMdTime /> Event history
          </button>
          <button
            className="btn btn-success"
            onClick={() => document.getElementById("event_modal").showModal()}
          >
            + Add events
          </button>
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
            borderColor="border-warning"
          />
        </>
      )}

      {/* === Modal === */}
      <dialog id="event_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create New Event</h3>
          <form onSubmit={handleCreate} className="grid gap-4">
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
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={formData.has_promo}
                onChange={(e) =>
                  setFormData({ ...formData, has_promo: e.target.checked })
                }
              />
              Has promo?
            </label>

            {formData.has_promo && (
              <input
                type="number"
                min="0"
                max="10"
                placeholder="Promo token quantity"
                className="input input-bordered w-full"
                value={formData.quantity_token}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity_token: parseInt(e.target.value) || 0,
                  })
                }
              />
            )}

            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Create
              </button>
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
        </div>
      </dialog>
    </div>
  );
};

export default DashboardClub;
