import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import axiosInstance from "../../axiosInstance/axiosInstance";
import ClubCard from "../../components/ClubCard/ClubCard";
import { FaCrown } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  console.log("asdf", modalData)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/students/profile/");
        if (res.data.length > 0) setCurrentUserId(res.data[0].id);
      } catch (err) {
        console.error("User profile fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/clubs/list/");
      setClubs(response.data);
    } catch (error) {
      console.error("Error fetching club data:", error);
      setError("Failed to load club data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const openModal = async (clubId) => {
    setShowModal(true);
    setModalData(null);
    try {
      const res = await axiosInstance.get(`/api/v1/clubs/${clubId}/`);
      setModalData(res.data);
    } catch (err) {
      console.error("Single club fetch error:", err);
    }
  };
  console.log("SS", modalData);
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="p-4 bg-gradient-to-br from-base-100 via-base-200 to-base-300 rounded min-h-screen w-full max-w-6xl mx-auto">
      <ToastContainer position="bottom-right" autoClose={5000} theme="dark" />
      <h1 className="md:text-4xl text-2xl font-bold mb-8">Clubs</h1>

      {/* Grid with animation */}
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
                  onUpdate={fetchClubs}
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
            className="fixed inset-0 z-50 flex items-center p-4 justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-base-100 xl:max-w-xl lg:max-w-lg sm:max-w-sm md:max-w-lg max-w-sm w-full rounded-xl shadow-xl p-6 overflow-y-auto max-h-[90vh]"
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
                  <motion.img
                    src={modalData.logo}
                    alt="club logo"
                    className="w-16 h-16 object-cover rounded-full border"
                    initial={{ rotate: -10, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold uppercase">
                    {modalData.name[0] || "?"}
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

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 text-sm text-base-content/70"
              >
                <FaCrown className="text-warning shrink-0" />
                <p className="font-medium truncate">
                  Leader:{" "}
                  <span className="font-bold">
                    {modalData.leader?.name || "—"}{" "}
                    {modalData.leader?.surname || ""}
                  </span>
                </p>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm flex items-center gap-2 text-base-content/70"
              >
                <BsFillLightningChargeFill className="text-yellow-500" />
                <p className="font-medium">
                  Points:{" "}
                  <span className="font-bold text-info">
                    {modalData.tokens ?? 0}
                  </span>
                </p>
              </motion.div>

              {/* Followers section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  Followers ({modalData.followers?.count || 0})
                </h3>


                {modalData.followers?.results?.length > 0 ? (
                  <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.1 } },
                    }}
                    className="space-y-2 pt-2"
                  >
                    {modalData.followers.results.map((follower) => (
                      <motion.li
                        key={follower.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 border-b pb-2"
                      >
                        {follower.image ? (
                          <img
                            src={`https://api.univibe.uz${follower.image}`}
                            alt={follower.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                            {follower.name[0]}
                          </div>
                        )}
                        <span className="font-medium">
                          {follower.name} {follower.surname}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  <p>No followers yet.</p>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
