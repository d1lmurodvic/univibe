import React from "react";
import StudentRow from "./StudentRow";
import { motion } from "framer-motion";

const tableVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const StudentsTable = ({ students, page, pageSize }) => {
  return (
    <motion.table
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="table w-full shadow-2xl"
    >
      <thead className="bg-gradient-to-r  from-primary to-secondary">
        <tr>
          <th className="text-primary-content font-bold text-lg">Rank</th>
          <th className="text-primary-content font-bold text-lg">Name</th>
          <th className="text-primary-content font-bold text-lg">Surname</th>
          <th className="text-primary-content font-bold text-lg">Faculty</th>
          <th className="text-primary-content font-bold text-lg">Grade</th>
          <th className="text-primary-content font-bold text-lg">Coin</th>
        </tr>
      </thead>
      <motion.tbody variants={tableVariants}>
        {students.map((student, idx) => (
          <StudentRow
            key={student.id}
            item={student}
            index={(page - 1) * pageSize + idx}
          />
        ))}
      </motion.tbody>
    </motion.table>
  );
};

export default StudentsTable;
