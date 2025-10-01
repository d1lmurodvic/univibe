import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import axiosInstance from "../../axiosInstance/axiosInstance";
import ClubCard from "../../components/ClubCard/ClubCard";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/api/v1/students/profile/");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCurrentUserId(res.data[0].id);
        } else if (res.data?.id) {
          setCurrentUserId(res.data.id);
        }
      } catch (err) {
        console.error("User profile fetch error:", err);
      }
    })();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/clubs/list/");
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching club data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClubs();
  }, []);

  // 🔑 Klub ma’lumotlari (followers shu yerda bo‘lishi shart)
  const refreshModal = async (clubId) => {
    try {
      const clubRes = await axiosInstance.get(`/api/v1/clubs/${clubId}/`);
      setModalData(clubRes.data);
    } catch (err) {
      console.error("refreshModal error:", err);
    }
  };

  const openModal = (clubId) => {
    setShowModal(true);
    setModalData(null);
    refreshModal(clubId);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="p-4 bg-base-100 rounded min-h-screen w-full max-w-6xl mx-auto">
      <ToastContainer position="bottom-right" autoClose={5000} theme="dark" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-6"
      >
        Clubs
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <AnimatePresence>
            {clubs.map((club, i) => (
              <motion.div
                key={club.id}
                custom={i}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                variants={cardVariants}
              >
                <ClubCard
                  club={club}
                  onClick={openModal}
                  currentUserId={currentUserId}
                  onUpdate={(id) => {
                    fetchClubs();
                    if (showModal && modalData?.id === id) {
                      refreshModal(id);
                    }
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && modalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-base-100 max-w-lg w-full rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{modalData.name}</h2>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {modalData.logo ? (
                  <img
                    src={
                      modalData.logo.startsWith("http")
                        ? modalData.logo
                        : `https://api.univibe.uz${modalData.logo}`
                    }
                    alt="club logo"
                    className="w-20 h-20 object-cover rounded-full border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold uppercase">
                    {modalData.name?.[0] || "?"}
                  </div>
                )}
                <div>
                  <p>
                    <strong>Category:</strong>{" "}
                    {modalData.category?.name || "Uncategorized"}
                  </p>
                  <p>
                    <strong>Points:</strong> {modalData.tokens ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-base-content/70 mb-2">
                <FaCrown className="text-warning shrink-0" />
                <p className="font-medium">
                  Leader:{" "}
                  <span className="font-bold">
                    {modalData.leader?.name || "—"}{" "}
                    {modalData.leader?.surname || ""}
                  </span>
                </p>
              </div>

              <div className="text-sm flex items-center gap-2 text-base-content/70 mb-4">
                <BsFillLightningChargeFill className="text-yellow-500" />
                <p className="font-medium">
                  Points:{" "}
                  <span className="font-bold text-info">
                    {modalData.tokens ?? 0}
                  </span>
                </p>
              </div>

              {/* ✅ Followers list – backenddan followers maydoni bo‘lsa ishlaydi */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold">
                  Followers ({modalData.followers?.length || 0})
                </h3>
                {modalData.followers?.length ? (
                  <ul className="space-y-2 mt-2">
                    {modalData.followers.map((f) => (
                      <li
                        key={f.id}
                        className="flex items-center gap-3 border-b pb-2"
                      >
                        {f.image ? (
                          <img
                            src={
                              f.image.startsWith("http")
                                ? f.image
                                : `https://api.univibe.uz${f.image}`
                            }
                            alt={f.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                            {f.name?.[0] || "?"}
                          </div>
                        )}
                        <span className="font-medium">  
                          {f.name} {f.surname}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-base-content/60">No followers yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
