import React from "react";
import { motion } from "framer-motion";
import { UserRound, Medal } from "lucide-react";

export default function TopUserRatings({ ratings = [], onClick }) {
  const top = ratings.slice(0, 5);
  const serverUrl = import.meta.env.VITE_API_URL;

  return (
    <motion.div
      className="
        w-full 
        rounded-2xl 
        shadow-2xl 
        border border-base-300 
        bg-base-100
        p-6
        /* 👉 make container BIG on phones */
        max-w-full
        sm:max-w-md
      "
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className="
          text-3xl        /* 📱 big title on mobile */
          sm:text-2xl    /* shrink slightly on >=640px */
          font-extrabold 
          mb-6 
          text-center 
          text-primary
        "
      >
        🏆 Top 5 Champions
      </h2>

      <ul className="space-y-6 sm:space-y-4">
        {top.length ? (
          top.map((u, i) => (
            <motion.li
              key={i}
              whileHover={{ scale: 1.03 }}
              className="
                flex items-center gap-5 sm:gap-4
                bg-base-200/80
                rounded-xl
                p-4         /* 📱 bigger padding */
                sm:p-3
                hover:bg-base-300/90
                transition
              "
              onClick={onClick}
            >
              {/* Rank number / medal */}
              <span
                className="
                  w-14 h-14       /* 📱 larger circle */
                  sm:w-10 sm:h-10
                  flex items-center justify-center
                  rounded-full
                  bg-primary/20 text-primary
                  text-2xl sm:text-lg
                  font-bold
                "
              >
                {i + 1}
              </span>

              {/* Avatar */}
              {u.image ? (
                <img
                  src={`${serverUrl}${u.image}`}
                  alt={u.name || "User"}
                  className="
                    w-16 h-16          /* 📱 large avatar */
                    sm:w-12 sm:h-12
                    rounded-full object-cover
                    border-2 border-primary/30
                  "
                />
              ) : (
                <div
                  className="
                    w-16 h-16
                    sm:w-12 sm:h-12
                    rounded-full
                    bg-base-300
                    flex items-center justify-center
                    text-base-content/60
                  "
                >
                  <UserRound className="w-8 h-8 sm:w-6 sm:h-6" />
                </div>
              )}

              {/* Name & grade */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg sm:text-base truncate">
                  {u.name || "User"}
                </p>
                <p className="text-base sm:text-sm text-base-content/70">
                  {u.grade?.grade_name || "No grade"}
                </p>
              </div>

              {i < 3 && (
                <Medal className="text-warning w-7 h-7 sm:w-5 sm:h-5" />
              )}
            </motion.li>
          ))
        ) : (
          <li className="text-center text-base-content/60 py-6">
            No champions yet!
          </li>
        )}
      </ul>
    </motion.div>
  );
}
