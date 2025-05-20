import { createSlice } from "@reduxjs/toolkit";

import loadAuthData from "@features/auth/loadAuthData";

const initialData = loadAuthData();
const initialState = {
  user: initialData?.user || null,
  token: initialData?.token || null,
  isAuthenticated: !!initialData?.token, // 是否取得 token(驗證成功)
  isLoading: true, // 是否等待驗證中
  isVerified: false, // 是否驗證完 token
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth");
    },
    setVerified: state => {
      state.isLoading = false;
      state.isVerified = true;
    },
    finishLoading: state => {
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, finishLoading, setError, clearError, setVerified } =
  authSlice.actions;
export default authSlice.reducer;
