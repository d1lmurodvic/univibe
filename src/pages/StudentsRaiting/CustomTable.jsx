import React, { useState, useEffect } from 'react';
import CustomPagination from '../CustomPagination/CustomPagination';
import Loading from '../../components/Loading/Loading';
import axiosInstance from '../../axiosInstance/axiosInstance';
import studentImage from '../../../public/students.png';
import { TbMoodSad } from "react-icons/tb";

const StudentsTable = ({ filterStudents }) => {
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
                console.log("hushuxhi",data)
            } catch (err) {
                setError('Error fetching student data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page]);

    const searchUsers = students
        .filter(student =>
            student.name.toLowerCase().includes(filterStudents?.toLowerCase() || '')
        )
        .sort((a, b) => a.id - b.id);

    if (loading) return <Loading />;
    if (error) return <div className="text-error p-4 bg-error/10 rounded-lg">{error}</div>;

    return (
        <div className="rounded-2xl p-1">
            <div className="bg-base-100 rounded-2xl shadow-xl border border-primary/20 ">
                <div className="rounded-2xl">
                    <table className="table table-zebra">
                        <thead className="bg-gradient-to-r from-primary to-secondary">
                            <tr>
                                <th className="text-primary-content font-bold text-lg">Id</th>
                                <th className="text-primary-content font-bold text-lg">Name</th>
                                <th className="text-primary-content font-bold text-lg">Surname</th>
                                <th className="text-primary-content font-bold text-lg">Faculty</th>
                                <th className="text-primary-content font-bold text-lg">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <img src="/notfound.png" alt="Not Found" className="w-[22%] mb-4" />
                                            <div className='flex items-center gap-2'>
                                                <p className="text-xl font-semibold">No data found</p>
                                                <TbMoodSad className='text-xl font-semibold' />

                                            </div>
                                        </div>
                                    </td>
                                </tr>

                            ) : (
                                searchUsers.map((item) => (
                                    <tr key={item.id} className="hover:bg-primary/5 transition-colors duration-200">
                                        <td>
                                            <p className="p-2 flex items-center rounded-full border-2 border-primary h-10 w-10 justify-center">
                                                {item.id}
                                            </p>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12 ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                                                        <img src={item?.image || studentImage} alt="Student Avatar" />
                                                    </div>
                                                </div>
                                                <p className="font-bold">{item.name}</p>
                                            </div>
                                        </td>
                                        <td><p className="font-bold">{item.surname}</p></td>
                                        <td><p className="font-bold">{item.faculty?.faculty_name}</p></td>
                                        <td><p className="btn btn-primary">{item.grade?.grade_name}</p></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center my-4">
                <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default StudentsTable;