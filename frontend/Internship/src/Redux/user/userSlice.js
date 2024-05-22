import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/users/register`,
      userData
    );
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    dispatch(success());
    dispatch(loadUser());
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const loginUser = (loginData) => async (dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/users/login`,
      loginData
    );
    localStorage.setItem("accessToken", data.data.accessToken);
    localStorage.setItem("refreshToken", data.data.refreshToken);
    dispatch(success());
    dispatch(loadUser());
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(request());
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/users/logout`
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(success());
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      withCredentials: true,
    };
    dispatch(loadUserRequest());
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/users/me`,
      config
    );
    dispatch(loadUserSuccess(data.data));
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    isAuthenticated:false,
  },
  reducers: {
    request: (state, action) => {
      state.loading = true;
    },
    success: (state, action) => {
      state.loading = false;
    },
    loadUserRequest: (state, action) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    catchError: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    clearErrors: (state, action) => {
      state.error = null;
    },
  },
});
export const {
  request,
  success,
  loadUserRequest,
  loadUserSuccess,
  catchError,
  clearErrors,
} = userSlice.actions;
export default userSlice.reducer;
