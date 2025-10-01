import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import axiosInstance from "../../axiosInstance/axiosInstance";
import { motion } from "framer-motion";
import ShopContent from "../../components/ShopContent/ShopContent";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopHistoryItem from "../../components/ShopHistoryItem/ShopHistoryItem";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [shopHistory, setShopHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const user = useSelector((state) => state.auth.userInfo[0]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "history") {
      fetchShopHistory();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/shop/student/products/");
      setProducts(response.data);
      console.log("Products", response.data);
    } catch (error) {
      console.error("Error fetching shop data:", error);
      setError("Failed to load shop data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchShopHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await axiosInstance.get("/api/v1/shop/history/");
      setShopHistory(response.data);
      console.log("Shop History", response.data);
    } catch (error) {
      console.error("Error fetching shop history:", error);
      setHistoryError("Failed to load shop history. Please try again later.");
    } finally {
      setHistoryLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-4 bg-gradient-to-br from-base-100 via-base-200 to-base-300 rounded min-h-screen w-full max-w-6xl mx-auto"
    >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <h1 className="md:text-4xl text-2xl font-bold mb-8" role="heading" aria-level="1">
        Shop
      </h1>

      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === "products" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab ${activeTab === "history" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Shop History
        </button>
      </div>

      {activeTab === "products" ? (
        <ShopContent
          products={products}
          loading={loading}
          error={error}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-base-200 p-6 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-4">Shop History</h2>
          {historyLoading ? (
            <Loading/>
          ) : historyError ? (
            <div className="text-error p-6">{historyError}</div>
          ) : shopHistory.length > 0 ? (
            <ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2">
              {shopHistory.map((item) => (
                <ShopHistoryItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-center text-base-content/70">
              No purchase history available.
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Shop;
