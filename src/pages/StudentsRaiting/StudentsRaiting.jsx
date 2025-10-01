import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance/axiosInstance";
import CustomPagination from "../CustomPagination/CustomPagination";
import Loading from "../../components/Loading/Loading";
import StudentsTable from "./StudentsTable";
import StudentsCardList from "./StudentsCardList";
import NoData from "./NoData";
import { motion } from "framer-motion";

const Students = ({ filterStudents }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/api/v1/students/rating/?page=${page}&page_size=${pageSize}`
        );

        const sortedStudents = [...data.results].sort(
          (a, b) => b.total_coins - a.total_coins
        );

        setStudents(sortedStudents);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (err) {
        setError("Error fetching student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const myData = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/api/v1/students/rating-position/"
        );
        setMyRating(data);
      } catch (error) {
        console.log("error:", error);
      }
    };

    myData();
  }, []);

  const isFiltered = Boolean(filterStudents?.trim());

  const searchUsers = students
    .filter((student) =>
      student.name.toLowerCase().includes(filterStudents?.toLowerCase() || "")
    )
    .sort((a, b) => b.total_coins - a.total_coins);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="text-error p-4 bg-error/10 rounded-lg text-center">
        {error}
      </div>
    );

  return (
    <motion.div
      className="p-2 sm:p-4 max-w-7xl mx-auto flex flex-col ml-4 mr-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-2xl font-semibold mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Students Rating
      </motion.h1>

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="overflow-x-auto rounded-box border-1 border-primary">
          <table className="table">
            <thead className="bg-gradient-to-r from-primary to-secondary">
              <tr className="text-base-c">
                <th className="text-primary-content font-bold text-xl">
                  My Position
                </th>
                <th className="text-primary-content font-bold text-xl">Name</th>
                <th className="text-primary-content font-bold text-xl">
                  My Coins
                </th>
                <th className="text-primary-content font-bold text-xl">Id</th>
              </tr>
            </thead>
            <tbody>
              {myRating ? (
                <tr>
                  <td className="text-base-content font-bold text-lg">
                    {myRating.position}
                  </td>
                  <td className="text-base-content font-bold text-lg">
                    {myRating.name} {myRating.surname}
                  </td>
                  <td className="text-base-content font-bold text-lg">
                    <span className="pl-1 pr-1 bg-warning text-primary-content rounded-2xl">
                      {myRating.total_coins}
                    </span>
                  </td>
                  <th className="text-base-content font-bold text-lg">
                    {myRating.user_id}
                  </th>
                </tr>
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-neutral-500">
                    Loading your rating...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Students List */}
      <motion.div
        className="bg-base-100 rounded-2xl shadow-xl border border-primary/20 mt-4"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="hidden md:block overflow-x-auto rounded-2xl">
          {searchUsers.length === 0 ? (
            <NoData />
          ) : (
            <StudentsTable
              students={searchUsers}
              page={page}
              pageSize={pageSize}
            />
          )}
        </div>
        <div className="block md:hidden space-y-4 p-4">
          {searchUsers.length === 0 ? (
            <NoData />
          ) : (
            <StudentsCardList
              students={searchUsers}
              page={page}
              pageSize={pageSize}
              isFiltered={isFiltered}
            />
          )}
        </div>
      </motion.div>

      {/* Pagination */}
      <motion.div
        className="flex items-center justify-center my-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>
    </motion.div>
  );
};

export default Students;
