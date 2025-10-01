import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import MobileNav from './components/MobileNav/MobileNav';
import axiosInstance from './axiosInstance/axiosInstance';
import { restoreAuth, loginFailure } from './redux/slices/authSlice';
import { fetchUserInfo } from './redux/slices/authThunk';

function App() {
  const dispatch = useDispatch();
  const { accessToken, role } = useSelector((state) => state.auth);
  console.log(role)
  const isRehydrated = useSelector((state) => state.auth._persist?.rehydrated || false);
  const baseUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.auth.userInfo?.[0]);

  const getApiEndpoint = (role) => {
    switch (role) {
      case 'club':
        return `${baseUrl}/api/v1/clubs/profile/`;
      case 'student':
        return `${baseUrl}/api/v1/students/profile/`;
      case 'admin':
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isRehydrated && accessToken && role) {
      const infoUrl = getApiEndpoint(role);
      if (!infoUrl) return;

      const fetchData = async () => {
        try {
          await axiosInstance.get(infoUrl);
          if (role === 'student') {
            dispatch(fetchUserInfo());
          }
        } catch (error) {
          console.error('Не удалось получить данные пользователя:', error.response?.data || error.message);
          dispatch(loginFailure('Ошибка авторизации'));
        }
      };

      fetchData();

      if (role === 'user') {
        const interval = setInterval(() => {
          dispatch(fetchUserInfo());
        }, 15000);

        return () => clearInterval(interval);
      }
    }
  }, [isRehydrated, accessToken, role, dispatch]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:min-w-2/12 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Navbar tokens={user?.active_tokens} />
        <div className="py-4 mb-16 md:mb-0 md:max-h-[90vh] overflow-y-auto">
          <Outlet />
        </div>
        <div className="block md:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}

export default App;