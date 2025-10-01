import React from "react";
import studentImage from "../../../public/students.png";
import { motion } from "framer-motion";

const getMedalEmoji = (index) => {
  return ["🥇", "🥈", "🥉"][index] || index + 1;
};

const getGradeColor = (grade) => {
  switch (grade) {
    case "Senior":
      return "bg-warning text-black";
    case "Middle":
      return "bg-info text-base-content";
    case "Junior":
      return "bg-success text-base-content";
    default:
      return "bg-base-300 text-base-content";
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const StudentRow = ({ item, index }) => {
  console.log("item:", item);
  return (
    <motion.tr
      variants={rowVariants}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
      className="hover:bg-base-200 transition-all "
    >
      <td className="text-center font-bold text-lg">{getMedalEmoji(index)}</td>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-10 w-10 ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              <img
                src={
                  item.image
                    ? `${import.meta.env.VITE_API_URL}${item.image}`
                    : studentImage
                }
                onError={(e) => (e.currentTarget.src = studentImage)}
                alt={`${item.name} avatar`}
                className="object-cover"
              />
            </div>
          </div>
          <p className="font-bold">{item.name}</p>
        </div>
      </td>
      <td className="font-bold">{item.surname}</td>
      <td className="font-bold">{item.faculty?.faculty_name}</td>
      <td>
        <p
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(
            item?.grade?.grade_name
          )}`}
        >
          {item?.grade?.grade_name}
        </p>
      </td>
      <td>
        <p className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-primary text-black">
          {item?.total_coins}
        </p>
      </td>
    </motion.tr>
  );
};

export default StudentRow;
