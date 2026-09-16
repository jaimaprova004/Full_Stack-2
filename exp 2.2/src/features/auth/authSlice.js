import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_USERS = [
  {
    id: "user-admin",
    name: "Nova",
    role: "Administrator",
    badge: "👑",
    permissions: ["admin:enter", "posts:view", "posts:edit", "posts:delete"],
  },
  {
    id: "user-editor",
    name: "Luna",
    role: "Editor",
    badge: "🛠️",
    permissions: ["posts:view", "posts:edit"],
  },
  {
    id: "user-viewer",
    name: "Aero",
    role: "Viewer",
    badge: "👁️",
    permissions: ["posts:view"],
  },
];

const initialState = {
  currentUser: null,
  users: DEFAULT_USERS,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthUsers = (state) => state.auth.users;

export default authSlice.reducer;
