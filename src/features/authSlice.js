import { createSlice } from "@reduxjs/toolkit";

// 🔥 localStorage se data uthao (refresh ke baad bhi login rahe)
const token = localStorage.getItem("token");

const validroles = ["ADMIN", "PATIENT", "DOCTOR"];
const storedRole = localStorage.getItem("role")
const role = validroles.includes(localStorage.getItem("role")) ?  storedRole : null;


const initialState = {
  isAuthenticated: token, // agar token hai → logged in
  user: null,
  token: token || null,
  role: role,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {

    // 🔐 LOGIN SUCCESS
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;

      state.user = action.payload.user;   // email store
      state.token = action.payload.token; // JWT token
      state.role = action.payload.role;   // 🔥 ROLE

      // 🔥 localStorage me save
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },

    // 🔓 LOGOUT
    logout: (state) => {
      state.isAuthenticated = false;

      state.user = null;
      state.token = null;
      state.role = null;

      // 🔥 localStorage clear
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },

  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;