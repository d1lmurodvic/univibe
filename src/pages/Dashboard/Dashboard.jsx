import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../axiosInstance/axiosInstance";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import TopUserRatings from "../../components/TopUserRating/TopUserRating";
import EventSwiper from "../../components/EventSwiper/EventSwiper";
import NewsBannerSwiper from "../../components/NewsBannerSwiper/NewsBannerSwiper";
import TodayEvents from "../../components/TodayEvents/TodayEvents";
import UpcomingEvents from "../../components/UpComingEvents/UpComingEvents";

// nisbiy rasm URLlarini to'liq qilish (kerak bo'lsa)
const ensureAbsolute = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://api.univibe.uz/${String(url).replace(/^\/+/, "")}`;
};

const Dashboard = () => {
  const [events, setEvents] = useState([]); // ✅ UPCOMING
  const [ratings, setRatings] = useState({ results: [] });
  const [activeEvents, setActiveEvents] = useState([]); // ✅ TODAY
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, ratingsResponse, activeEventsRes, bannersRes] =
          await Promise.all([
            axiosInstance.get(
              "https://api.univibe.uz/api/v1/clubs/events/upcoming/"
            ),
            axiosInstance.get("/api/v1/students/rating/"),
            axiosInstance.get("/api/v1/clubs/events/today/"),
            axiosInstance.get(
              "https://api.univibe.uz/api/v1/news/student/banner/"
            ),
          ]);

        // UPCOMING normalize
        const upcomingRaw = Array.isArray(upcomingRes.data)
          ? upcomingRes.data
          : upcomingRes.data?.results ?? [];

        const upcoming = upcomingRaw.map((e) => ({
          ...e,
          // Swiper uchun rasm maydoni borligini ta’minlaymiz
          image: ensureAbsolute(
            e.image ||
              e.cover ||
              e.banner ||
              e.photo ||
              e.thumbnail ||
              e.img ||
              e.picture ||
              e.image_url ||
              e.file ||
              e.url
          ),
        }));

        // RATINGS normalize
        const ratingList = Array.isArray(ratingsResponse.data)
          ? ratingsResponse.data
          : ratingsResponse.data?.results ?? [];

        // TODAY normalize
        const today = Array.isArray(activeEventsRes.data)
          ? activeEventsRes.data
          : activeEventsRes.data?.results ?? [];

        // BANNERS normalize
        const bannerList = Array.isArray(bannersRes.data)
          ? bannersRes.data
          : bannersRes.data?.results ?? [];

        setEvents(upcoming); // ✅ upcoming set
        setRatings({ results: ratingList });
        setActiveEvents(today);
        setBanners(bannerList);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-error p-6">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="md:p-4 px-1 bg-base-100 rounded md:min-h-screen md:w-full md:max-w-6xl mx-auto"
    >
      <h1 className="text-2xl md:text-4xl ml-5 md:ml-0 font-bold mb-3 md:mb-8">
        Dashboard
      </h1>

      <motion.div
        className="bg-base-100 p-6 rounded-xl md:shadow-xl md:border 
  border-base-300 w-full max-w-[1200px] mx-auto mb-6"
      >
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Latest Events</h2>
        <NewsBannerSwiper banners={banners} height={350} />
      </motion.div>

      <motion.div className="bg-base-100 p-6 rounded-xl md:shadow-xl md:border border-base-300 w-full mt-6">
        <h2 className="text-lg md:text-2xl font-semibold mb-4">
          Today’s Events (All)
        </h2>
        <TodayEvents
          events={activeEvents}
          onOpen={(ev) => console.log("OPEN EVENT:", ev)}
        />
      </motion.div>

      <motion.div className="bg-base-100 p-6 rounded-xl flex flex-col lg:grid lg:grid-cols-3 gap-6 md:shadow-xl md:border border-base-300 w-full mt-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg md:text-2xl font-semibold mb-4">
            Upcoming Events
          </h2>
          <UpcomingEvents
            events={events}
            onOpen={(e) => console.log("OPEN UPCOMING:", e)}
          />
        </div>

        {/* Top 5 Champions */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md">
            <TopUserRatings
              ratings={ratings.results}
              onClick={() => navigate("/rating")}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
