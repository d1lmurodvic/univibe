import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message = 'Loading...', isFullScreen = true }) => {
  const containerClasses = isFullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center';

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="loading loading-spinner loading-lg text-primary"
          animate={{
            rotate: 360,
            transition: { repeat: Infinity, duration: 1, ease: 'linear' },
          }}
        />
        <motion.p
          className="text-base-content text-lg font-medium"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loading;