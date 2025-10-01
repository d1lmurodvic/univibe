import React, { useEffect, useRef, useState } from "react";
import {
  User, GraduationCap, Hash, Coins, BookOpen,
  Award, PencilLine, X, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../axiosInstance/axiosInstance";
import { toast } from "react-toastify";
import coin from "../../assets/coin.png";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/students/profile/");
      if (response.data.length > 0) {
        setProfile(response.data[0]);
      } else {
        setError("Ma'lumot topilmadi");
      }
    } catch (error) {
      console.error(error);
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openFilePicker = () => {
    setIsEditing(true);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Faqat JPG, PNG yoki WEBP rasmlar qo‘llanadi.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm 5MB dan katta bo‘lmasin.");
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const cancelEdit = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = async (e) => {
    e?.preventDefault?.();
    if (!selectedFile) return openFilePicker();

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      await axiosInstance.put(`/api/v1/students/profile/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Rasm muvaffaqiyatli yuklandi!");
      cancelEdit();
      await fetchProfile();
    } catch (err) {
      console.error("Image Upload Error:", err);
      toast.error("Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

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
        <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-300 text-center">
          <User className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-lg text-error">{error}</p>
        </div>
      </div>
    );
  }

  const avatarSrc =
    previewImage ||
    (profile?.image
      ? `https://api.univibe.uz${profile.image}?v=${profile.image_updated_at}`
      : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-base-100 py-8 px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-base-200 rounded-2xl shadow-md p-6 space-y-6"
      >
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border border-base-300 shadow-sm">
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <button
              type="button"
              onClick={openFilePicker}
              className="absolute -bottom-1 -left-1 btn btn-xs btn-primary rounded-full shadow-md flex items-center gap-1 opacity-90 group-hover:opacity-100"
              disabled={uploading}
              title="Profil rasmni tahrirlash"
            >
              <PencilLine className="w-3 h-3" />
              Edit
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </motion.div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-semibold text-base-content capitalize">
              {profile.name} {profile.surname}
            </h1>
            <p className="flex items-center justify-center md:justify-start mt-1 text-base-content">
              <GraduationCap className="w-4 h-4 mr-2 text-primary" />
              {profile.faculty.faculty_name}
            </p>
            <p className="flex items-center justify-center md:justify-start text-base-content">
              <BookOpen className="w-4 h-4 mr-2 text-secondary" />
              {profile.grade.grade_name}
            </p>
          </div>
        </div>

        {/* Edit action bar */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between bg-base-100 border border-base-300 p-3 rounded-xl"
            >
              <div className="text-sm">
                {selectedFile ? (
                  <span className="opacity-80">
                    Tanlangan fayl: <span className="font-medium">{selectedFile.name}</span>
                  </span>
                ) : (
                  <span className="opacity-80">Yangi rasm tanlash uchun oyna ochildi.</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={cancelEdit} className="btn btn-sm btn-ghost" disabled={uploading}>
                  <X className="w-4 h-4 mr-1" /> Bekor qilish
                </button>
                <button
                  onClick={handleImageUpload}
                  className="btn btn-sm btn-primary"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Check className="w-4 h-4 mr-1" />
                  )}
                  Saqlash
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            {
              img: <img src={coin} className="w-6 h-6 mr-3" />,
              label: "Total Coins",
              value: profile.active_tokens?.toLocaleString(),
              color: "primary",
            },
            {
              icon: <Hash className="w-6 h-6 mr-3" />,
              label: "University ID",
              value: `#${profile.university_id}`,
              color: "secondary",
            },
            {
              icon: <GraduationCap className="w-6 h-6 mr-3" />,
              label: "Grade Level",
              value: profile.grade.grade_name,
              color: "accent",
            },
            {
              icon: <User className="w-6 h-6 mr-3" />,
              label: "Profile ID",
              value: `#${profile.id}`,
              color: "success",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className={`flex items-center bg-${item.color}/10 text-${item.color} rounded-lg p-3`}
            >
              {item.img || item.icon}
              <div>
                <p className="text-sm">{item.label}</p>
                <p className="text-lg font-medium">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* GPA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-base-100 border border-base-300 p-4 rounded-xl space-y-3"
        >
        
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
