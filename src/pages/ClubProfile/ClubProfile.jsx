import React, { useEffect, useRef, useState } from 'react';
import { User, Hash, Coins, Award, PencilLine, X, Check, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../axiosInstance/axiosInstance';
import { toast } from 'react-toastify';

const ClubProfile = () => {
  const [clubProfile, setClubProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const fetchClubProfile = async () => {
    try {
      const response = await axiosInstance.get('https://api.univibe.uz/api/v1/clubs/profile/');
      if (response.data) {
        setClubProfile(response.data);
      } else {
        setError("Ma'lumot topilmadi");
      }
    } catch (error) {
      console.error('Fetch Profile Error:', error);
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubProfile();
  }, []);

  const openFilePicker = () => {
    setIsEditing(true);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = async (e) => {
    e?.preventDefault?.();

    if (!selectedFile) {
      toast.error("Rasm tanlanmagan.");
      return;
    }

    if (!clubProfile?.id) {
      toast.error("Klub ID mavjud emas!");
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedFile); 

    formData.append('club_id', clubProfile.id);

    try {
      setUploading(true);

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axiosInstance.put(
        'https://api.univibe.uz/api/v1/clubs/update-logo/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success("Rasm muvaffaqiyatli yuklandi!");
      cancelEdit();
      await fetchClubProfile(); 
    } catch (err) {
      console.error('Image Upload Error:', err);
      let errorMessage = 'Rasm yuklashda xatolik';
      if (err.response?.data) {
        errorMessage = err.response.data.error || JSON.stringify(err.response.data);
        console.error('Server Response:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error details:', err.message);
      }
      toast.error(`Error: ${errorMessage}`);
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
    (clubProfile?.logo
      ? `https://api.univibe.uz${clubProfile.logo}?v=${clubProfile.logo_updated_at}`
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
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group"
          >
            <div className="w-28 h-28 rounded-full overflow-hidden border border-base-300 shadow-sm">
              <img src={avatarSrc} alt="Club Logo" className="w-full h-full object-cover" />
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
              {clubProfile.name}
            </h1>
            <p className="flex items-center justify-center md:justify-start mt-1 text-base-content">
              <Hash className="w-4 h-4 mr-2 text-primary" />
              {clubProfile.id}
            </p>
            <p className="flex items-center justify-center md:justify-start text-base-content">
              <Coins className="w-4 h-4 mr-2 text-secondary" />
              {clubProfile.tokens} tokens
            </p>
          </div>
        </div>

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

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[{
            icon: <Coins className="w-6 h-6 mr-3" />,
            label: 'Active Tokens',
            value: clubProfile.tokens?.toLocaleString(),
            color: 'primary',
          },
          {
            icon: <GraduationCap className="w-6 h-6 mr-3" />,
            label: 'Category',
            value: clubProfile.category.name,
            color: 'accent',
          },
          {
            icon: <User className="w-6 h-6 mr-3" />,
            label: 'Leader',
            value: `${clubProfile.leader?.name} ${clubProfile.leader?.surname}`,
            color: 'success',
          }].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className={`flex items-center bg-${item.color}/10 text-${item.color} rounded-lg p-3`}
            >
              {item.icon}
              <div>
                <p className="text-sm">{item.label}</p>
                <p className="text-lg font-medium">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ClubProfile;