import React, { useState } from "react";
import { motion } from "framer-motion";
import ShopCard from "../../components/ShopCard/ShopCard";
import Loading from "../Loading/Loading";

const ShopContent = ({ products, loading, error, setSearchTerm }) => {
  const [searchTerm, setLocalSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (setSearchTerm) setSearchTerm(value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) return <Loading/>
  if (error) return <div className="text-error p-6">{error}</div>;

  return (
    <>
      <motion.input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full max-w-md mb-6 p-2 rounded-lg border border-base-300 focus:outline-none focus:ring-2 focus:ring-secondary"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.map((product) => (
          <ShopCard key={product.id} product={product} />
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-base-content/70 mt-6">
          No products found. Try a different search!
        </p>
      )}
    </>
  );
};

export default ShopContent;