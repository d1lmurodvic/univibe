// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo } from "./authThunk";

const initialState = {
  userInfo: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // === Login actions ===
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { userInfo, role, accessToken, refreshToken } = action.payload;
      state.loading = false;
      state.userInfo = userInfo;
      state.role = role;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.error = null;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("isAuthenticated", "true");
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // === Token actions ===
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    // === Auth restore (e.g. on page reload) ===
    restoreAuth: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.role = action.payload.role;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    // === Logout ===
    logout: (state) => {
      state.userInfo = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
    },

    // ✅ Yangi action – foydalanuvchi ma’lumotini (masalan rasmni) yangilash
    updateUserInfo: (state, action) => {
      // `userInfo` sizning loginSuccess’da qanday saqlanayotganiga qarab
      // massiv bo‘lsa, uni ham shu formatda yangilash mumkin
      if (Array.isArray(state.userInfo)) {
        state.userInfo = [action.payload];
      } else {
        state.userInfo = action.payload;
      }
    },
  },

  // === Async thunk lar ===
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateAccessToken,
  restoreAuth,
  logout,
  updateUserInfo, // ✅ eksport qilish
} = authSlice.actions;

export default authSlice.reducer;
