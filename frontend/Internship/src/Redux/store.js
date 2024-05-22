import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./book/bookSlice.js";
import userReducer from "./user/userSlice.js";
export const store = configureStore({
  reducer: {
    BOOK: bookReducer,
    USER: userReducer,
  },
});
