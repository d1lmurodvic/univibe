import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import ClubCard from "../components/ClubCard/ClubCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ClubDetail() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // 🔹 Klub ma’lumotini olish
  const fetchClub = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/v1/clubs/18/");
      setClub(res.data);
    } catch (err) {
      console.error("Club fetch error:", err);
      setError("Ma'lumotni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p className="text-error text-lg">{error}</p>
      </div>
    );
  }

  const currentUserId = null; // kerak bo‘lsa Redux’dan oling

  const openModal = async () => {
    try {
      // ✅ View bosilganda so‘rov yuborish
      const res = await axiosInstance.get("/api/v1/clubs/18/");
      setModalData(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Modal fetch error:", err);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {club && (
        <>
          <div className="max-w-md mx-auto">
            <ClubCard
              club={club}
              currentUserId={currentUserId}
              onUpdate={fetchClub}
              onClick={openModal} // View bosilganda modal
            />
          </div>

          {/* ===== Modal ===== */}
          <AnimatePresence>
            {showModal && modalData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
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

                  {/* Logo & Category */}
                  <div className="flex items-center gap-4 mb-4">
                    {modalData.logo && (
                      <img
                        src={modalData.logo}
                        alt="logo"
                        className="w-20 h-20 object-cover rounded-full border"
                      />
                    )}
                    <div>
                      <p>
                        <strong>Category:</strong>{" "}
                        {modalData.category?.name || "—"}
                      </p>
                      <p>
                        <strong>Points:</strong> {modalData.tokens ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Leader */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Leader</h3>
                    <div className="flex items-center gap-3">
                      {modalData.leader?.image ? (
                        <img
                          src={`https://api.univibe.uz${modalData.leader.image}`}
                          alt="leader"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                          {modalData.leader?.name?.[0] || "?"}
                        </div>
                      )}
                      <p className="font-medium">
                        {modalData.leader?.name} {modalData.leader?.surname}
                      </p>
                    </div>
                  </div>

                  {/* Followers */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Followers</h3>
                    {modalData.followers && modalData.followers.length > 0 ? (
                      <ul className="space-y-2">
                        {modalData.followers.map((f) => (
                          <li
                            key={f.id}
                            className="flex items-center gap-3 border-b pb-2"
                          >
                            {f.image ? (
                              <img
                                src={`https://api.univibe.uz${f.image}`}
                                alt={f.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center">
                                {f.name[0]}
                              </div>
                            )}
                            <span className="font-medium">
                              {f.name} {f.surname}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No followers yet.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
