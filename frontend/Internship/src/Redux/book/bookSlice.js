import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const getBooks = (page, limit, keyword, year) => async (dispatch) => {
  try {
    dispatch(getBookRequest());
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/books?page=${page}&limit=${limit}&keyword=${keyword}&year=${year}`
    );
    dispatch(getBookSuccess(data.data));
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const createBook = (bookData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    dispatch(request());
    const { data } = await axios.post(
      `http://localhost:4000/api/v1/books`,
      bookData,
      config
    );
    dispatch(success());
    dispatch(getBooks(1, 10, "", 2024));
  } catch (error) {
    console.log(error);
    dispatch(catchError(error.message));
  }
};
export const updateBook = (id, updateData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    dispatch(request());
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/books/${id}`,
      updateData,
      config
    );
    dispatch(success());
    dispatch(getBooks(1, 10, "", 2024));
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const deleteBook = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
    dispatch(request());
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/books/${id}`,
      config
    );
    dispatch(success());
    dispatch(getBooks(1, 10, "", 2024));
  } catch (error) {
    dispatch(catchError(error.message));
  }
};
export const bookSlice = createSlice({
  name: "Book",
  initialState: {
    books: [],
  },
  reducers: {
    getBookRequest: (state, action) => {
      state.loading = true;
    },
    getBookSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    catchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    request: (state) => {
      state.loading = true;
    },
    success: (state) => {
      state.loading = false;
    },
  },
});
export const { getBookRequest, getBookSuccess, catchError, request, success } =
  bookSlice.actions;
export default bookSlice.reducer;
