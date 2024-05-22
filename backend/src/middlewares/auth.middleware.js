import AsyncHandler from "../utils/AsyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
export const verifyJWT = AsyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      throw new ErrorResponse("Unauthorized access", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ErrorResponse("Unauthorized access (No User)", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ErrorResponse(
      error.message || "Internal Server Error",
      error.statusCode || 500
    );
  }
});
