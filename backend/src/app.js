import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
export default app;
