import React, { useEffect, useState } from "react";
import { IoMdTime } from "react-icons/io";
import axios from "axios";

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://api.univibe.uz/api/v1/clubs/events/list/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data || []);
      } catch (err) {
        console.error("Fetch events error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      if (formData.img) fd.append("img", formData.img);
      if (formData.url) fd.append("url", formData.url);
      fd.append("event_datetime", formData.event_datetime);
      fd.append("registration_deadline", formData.registration_deadline);
      fd.append("has_promo", formData.has_promo);
      fd.append("quantity_token", formData.quantity_token);

      await axios.post(
        "https://api.univibe.uz/api/v1/clubs/events/create/",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const res = await axios.get(
        "https://api.univibe.uz/api/v1/clubs/events/list/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(res.data || []);
      document.getElementById("event_modal").close();
    } catch (err) {
      console.error("Create event error:", err);
    }
  };

  return (
    <div className="container mx-auto max-w-[95%] overflow-x-auto flex flex-col gap-4">
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
        <p>Loading events…</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="card bg-base-100 w-[25%] shadow-sm border-2 border-success"
            >
              <figure>
                <img
                  src={ev.img || "https://via.placeholder.com/400x200"}
                  alt={ev.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card p-2">
                <h2 className="card-title">{ev.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(ev.event_datetime).toLocaleString()}
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
              onChange={(e) =>
                setFormData({ ...formData, event_datetime: e.target.value })
              }
            />
            <input
              type="date"
              className="input input-bordered"
              required
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
                onChange={(e) =>
                  setFormData({ ...formData, has_promo: e.target.checked })
                }
              />
              Has promo?
            </label>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="Promo token quantity"
              className="input input-bordered"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity_token: parseInt(e.target.value) || 0,
                })
              }
            />
            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Create
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("event_modal").close()}
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
