import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance/axiosInstance';
import CustomPagination from '../CustomPagination/CustomPagination';
import Loading from '../../components/Loading/Loading';
import StudentsTable from './StudentsTable';
import StudentsCardList from './StudentsCardList';
import NoData from './NoData';

const Students = ({ filterStudents }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/api/v1/students/rating/?page=${page}&page_size=${pageSize}`);
        setStudents(data.results);
        setTotalPages(Math.ceil(data.count / pageSize));
        console.log("data:", data)
      } catch (err) {
        setError('Error fetching student data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const isFiltered = Boolean(filterStudents?.trim());

  const searchUsers = students
    .filter((student) =>
      student.name.toLowerCase().includes(filterStudents?.toLowerCase() || '')
    )
    .sort((a, b) => a.id - b.id);

  if (loading) return <Loading />;
  if (error) return <div className="text-error p-4 bg-error/10 rounded-lg text-center">{error}</div>;

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto m-10">
      <div className="bg-base-100 rounded-2xl shadow-xl border border-primary/20">
        <div className="hidden md:block overflow-x-auto rounded-2xl">
          {searchUsers.length === 0 ? <NoData /> : <StudentsTable students={searchUsers} page={page} pageSize={pageSize} />}
        </div>
        <div className="block md:hidden space-y-4 p-4">
          {searchUsers.length === 0 ? <NoData /> : <StudentsCardList students={searchUsers} page={page} pageSize={pageSize}     isFiltered={isFiltered} />}
        </div>
      </div>
      <div className="flex items-center justify-center my-6">
        <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Students;