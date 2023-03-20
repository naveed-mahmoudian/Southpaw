import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentPage: null,
  chatUser: null,
  notification: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.currentPage = null;
      state.chatUser = null;
      state.notification = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
    setChatUser: (state, action) => {
      state.chatUser = action.payload.chatUser;
    },
    setNotification: (state, action) => {
      state.notification = action.payload.notification;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setCurrentPage,
  setChatUser,
  setNotification,
} = authSlice.actions;

export default authSlice.reducer;
