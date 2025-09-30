import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://api.univibe.uz";

const DashboardClub = () => {
  const [events, setEvents] = useState([]);
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

  // === Normalize image URL ===
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://via.placeholder.com/400x200";
    if (imgPath.startsWith("http")) return imgPath;
    return `${BASE_URL}${imgPath}`;
  };

  // === Fetch events ===
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/clubs/events/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Events response:", res.data);
  
      // API returns paginated response { count, results }
      if (res.data?.results) {
        setEvents(res.data.results);
      } else if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Fetch events error:", err.response?.data || err.message);
      toast.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  // === Create event ===
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      if (formData.img) fd.append("img", formData.img);
      if (formData.url) fd.append("url", formData.url);
  
      // Convert datetime-local to ISO string (UTC)
      if (formData.event_datetime) {
        const dt = new Date(formData.event_datetime);
        fd.append("event_datetime", dt.toISOString());
      }
  
      // registration_deadline format: YYYY-MM-DD
      if (formData.registration_deadline) {
        const deadline = new Date(formData.registration_deadline)
          .toISOString()
          .split("T")[0];
        fd.append("registration_deadline", deadline);
      }
  
      // ✅ faqat promo belgilansa, quantity_token yuboramiz
      if (formData.has_promo) {
        fd.append("has_promo", "true");
        fd.append("quantity_token", String(formData.quantity_token));
      } else {
        fd.append("has_promo", "false");
        // ❌ quantity_token yuborilmaydi
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
  
  

  return (
    <div className="container mx-auto max-w-[95%] overflow-x-auto flex flex-col gap-4">
      {/* Header */}
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

      {/* Event cards */}
      {loading ? (
        <p>Loading events…</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="card bg-base-100 w-[25%] shadow-sm border-2 border-success"
            >
              <figure>
                <img
                  src={getImageUrl(ev.img)}
                  alt={ev.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card p-2">
                <h2 className="card-title">{ev.title}</h2>
                <p className="text-sm text-gray-500">
                  {ev.event_datetime
                    ? new Date(ev.event_datetime).toLocaleString()
                    : "No date"}
                </p>
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary"
                  >
                    Event Link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for create */}
      <dialog id="event_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Create New Event</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered"
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
              className="file-input file-input-bordered"
            />
            <input
              type="url"
              placeholder="Event URL"
              className="input input-bordered"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="input input-bordered"
              required
              value={formData.event_datetime}
              onChange={(e) =>
                setFormData({ ...formData, event_datetime: e.target.value })
              }
            />
            <input
              type="date"
              className="input input-bordered"
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

            {/* Promo input faqat checkbox true bo‘lsa ko‘rinadi */}
            {formData.has_promo && (
              <input
                type="number"
                min="0"
                max="10"
                placeholder="Promo token quantity"
                className="input input-bordered"
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
