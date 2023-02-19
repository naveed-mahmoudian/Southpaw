import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentPage: null,
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
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const { setLogin, setLogout, setCurrentPage } = authSlice.actions;

export default authSlice.reducer;
