import zod from "zod";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ErrorResponse from "../utils/ErrorResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
};
const registerBody = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(6),
  isAdmin: zod.boolean().optional().default(false),
});
const loginBody = zod.object({
  username: zod.string().optional(),
  email: zod.string().email().optional(),
  password: zod.string().min(6),
});
const updateBody = zod.object({
  username: zod.string().optional(),
  email: zod.string().email().optional(),
  password: zod.string().min(6).optional(),
  isAdmin: zod.boolean().optional(),
});
const registerUser = AsyncHandler(async (req, res) => {
  try {
    const { success } = registerBody.safeParse(req.body);
    if (!success) {
      throw new ErrorResponse("Invalid data", 400);
    }
    const { username, email, password, isAdmin } = req.body;
    const user = await User.create({
      username,
      email,
      password,
      isAdmin,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    req.user = user;
    const options = {
      httpOnly: true,
      domain: "localhost",
      path: "/",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, {accessToken,refreshToken}, "User registered successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const loginUser = AsyncHandler(async (req, res) => {
  try {
    const { success } = loginBody.safeParse(req.body);
    if (!success) {
      throw new ErrorResponse("Invalid data", 400);
    }
    const { username, email, password } = req.body;
    if (!username && !email) {
      throw new ErrorResponse("Username or Email is Required", 400);
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      throw new ErrorResponse("Invalid Credentials", 401);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ErrorResponse("Invalid Credentials", 401);
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const options = {
      httpOnly: true,
      domain: "localhost",
      path: "/",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, {accessToken,refreshToken}, "User logged in successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const logoutUser = AsyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { refreshToken: "" },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const updateUser = AsyncHandler(async (req, res) => {
  try {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      throw new ErrorResponse("Invalid Data", 404);
    }
    const { username, email, password, isAdmin } = req.body;
    const existingUsernameOrEmail = await User.find({
      $or: [{ username }, { email }],
    }).select("username email");
    if (!existingUsernameOrEmail.length > 1) {
      throw new ErrorResponse("Username or Email Already Exists", 400);
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username,
          password,
          isAdmin,
          email,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User updated Successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const deleteUser = AsyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Deleted Successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const loadUser = AsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User loaded succesfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
export {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  loadUser,
};
