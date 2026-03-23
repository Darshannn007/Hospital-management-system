import { createSlice } from "@reduxjs/toolkit";

// 🔥 localStorage se token uthao
const token = localStorage.getItem("token");

const initialState = {
  isAuthenticated: !!token,
  user: token ? { email: "persisted-user" } : null,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // 🔥 save token
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      // 🔥 remove token
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;