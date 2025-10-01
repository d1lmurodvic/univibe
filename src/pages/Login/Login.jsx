import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import loginImg from "/logowhite.png";

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaArrowRight, FaUser } from 'react-icons/fa';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const baseUrl = import.meta.env.VITE_API_URL;

  const getApiEndpoint = (role) => {
    switch (role) {
      case 'club':
        return {
          login: `${baseUrl}/api/v1/clubs/auth/login/`,
          info: `${baseUrl}/api/v1/clubs/profile/` 
        };
      case 'admin':
        return { login: `${baseUrl}/api/v1/staff/auth/login/`, info: null };
      case 'student':
      default:
        return {
          login: `${baseUrl}/api/v1/students/auth/login/`,
          info: `${baseUrl}/api/v1/students/profile/`
        };
    }
  };


  const onSubmit = async (data) => {
    setLoading(true);
    dispatch(loginStart());
    const requestData = {
      [role === 'student' ? 'email' : 'login']: data[role === 'student' ? 'email' : 'login'],
      password: data.password,
    };
    try {
      const { login: loginUrl, info: infoUrl } = getApiEndpoint(role);
      const loginResponse = await axios.post(loginUrl, requestData);

      console.log("login response:", loginResponse.data);
      const refreshToken = loginResponse.data.refresh_token;
      const accessToken = loginResponse.data.access_token;
      console.log('Login response:', loginResponse.data);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);

      let userInfo = {};
      if (infoUrl) {
        const infoResponse = await axios.get(infoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        userInfo = infoResponse.data;
      }

      dispatch(loginSuccess({ userInfo, role, refreshToken, accessToken }));

      toast.success('Login successful', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      if (role === 'admin') {
        window.location.href = 'https://sap-admin-99uo.vercel.app';
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      dispatch(loginFailure(error.response?.data || error.message));
      toast.error('Login failed', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };



  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-primary/20 to-base-300 p-4 sm:p-6 lg:p-8 overflow-hidden"
      animate={{
        background: [
          'linear-gradient(to bottom right, var(--color-base-100), var(--color-secondary) 50%, var(--color-base-300))',
        ],
      }}
    >
      {/* <ToastContainer
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
        transition={Flip}
      /> */}
      <motion.div
        className="flex flex-col lg:flex-row w-full max-w-5xl bg-base-100/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 lg:w-1/2"
          variants={itemVariants}
        >
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-secondary mb-4"
            variants={itemVariants}
          >
            Login
          </motion.h1>
          <motion.p
            className="text-base-content/70 mb-8 text-sm sm:text-base"
            variants={itemVariants}
          >
            Enter your login details
          </motion.p>

          <motion.div variants={itemVariants} className="tabs bg-base-100/30 w-full rounded-2xl p-2 justify-between tabs-boxed mb-6">
            <input
              type="radio"
              name="role_tabs"
              className={`tab rounded-2xl font-semibold flex-1 text-sm sm:text-base duration-300 ${role === 'student' ? 'tab-active bg-secondary/70 text-white shadow-md border-2 border-secondary' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                }`}
              aria-label="Student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />
            <input
              type="radio"
              name="role_tabs"
              className={`tab rounded-2xl flex-1 font-semibold text-sm sm:text-base transition-all duration-300 ${role === 'club' ? 'tab-active bg-secondary/70 text-white shadow-md border-2 border-secondary' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                }`}
              aria-label="Club"
              checked={role === 'club'}
              onChange={() => setRole('club')}
            />
            <input
              type="radio"
              name="role_tabs"
              className={`tab rounded-2xl flex-1 font-semibold text-sm sm:text-base transition-all duration-300 ${role === 'admin' ? 'tab-active bg-secondary/70 text-white shadow-md border-2 border-secondary' : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                }`}
              aria-label="Admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <label htmlFor={role === 'student' ? 'email' : 'login'} className="block mb-2 text-sm font-medium text-base-content">
                {role === 'student' ? 'Your email' : 'Your login'}
              </label>
              <div className="input input-bordered w-full flex items-center gap-2 bg-base-100/70">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaUser className="text-secondary" />
                </motion.div>
                <input
                  type="text"
                  id={role === 'student' ? 'email' : 'login'}
                  {...register(role === 'student' ? 'email' : 'login', {
                    required: role === 'student' ? 'Email is required' : 'Login is required',
                    minLength: { value: 1, message: role === 'student' ? 'Email must be at least 1 character' : 'Login must be at least 1 character' }
                  })}
                  className="w-full bg-transparent text-lg focus:outline-none"
                  placeholder={role === 'student' ? 'Your email' : 'Your login'}
                />
              </div>
              {errors[role === 'student' ? 'email' : 'login'] && (
                <motion.p
                  className="text-error text-sm mt-1"
                  initial={{ x: 0 }}
                  animate={{ x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } }}
                >
                  {errors[role === 'student' ? 'email' : 'login'].message}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-base-content">
                Your password
              </label>
              <div className="input input-bordered w-full flex items-center gap-2 bg-base-100/70">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaLock className="text-secondary" />
                </motion.div>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 1,
                      message: "Password must be at least 1 character",
                    },
                  })}
                  className="w-full text-lg bg-transparent focus:outline-none"
                  placeholder="••••••"
                />
              </div>
              {errors.password && (
                <motion.p
                  className="text-error text-sm mt-1"
                  initial={{ x: 0 }}
                  animate={{ x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={loading ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
              variants={itemVariants}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  Login
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaArrowRight className="ml-2" />
                  </motion.span>
                </>
              )}
            </motion.button>

            {loading && (
              <motion.div
                className="w-full mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <progress className="progress progress-primary w-full" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          variants={itemVariants}
        >
          <motion.img
            src={loginImg}
            alt="Login visual"
            className="object-cover w-full h-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-base-100/50 to-transparent"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;