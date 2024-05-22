import AsyncHandler from "../utils/AsyncHandler.js";
import zod, { pipeline } from "zod";
import ErrorResponse from "../utils/ErrorResponse.js";
import { Book } from "../model/book.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
const bookBody = zod.object({
  title: zod.string(),
  description: zod.string(),
  author: zod.string(),
  genre: zod.string(),
  year: zod.number().int().min(1000).max(9999),
});
const updateBody = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
  genre: zod.string().optional(),
  year: zod.number().int().min(1000).max(9999).optional(),
});
const createBook = AsyncHandler(async (req, res) => {
  try {
    const { success } = bookBody.safeParse(req.body);
    if (!success) {
      throw new ErrorResponse("Invalid Data", 400);
    }
    const { title, description, author, genre, year } = req.body;
    const book = await Book.create({
      title,
      description,
      author,
      genre,
      year,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, book, "Book Created Successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const updateBook = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      throw new ErrorResponse("Invalid Data", 400);
    }
    const book = await Book.findById(id);
    if (
      book.author.toString() != req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      throw new ErrorResponse("Not allowed to update book", 400);
    }
    const { title, description, genre, year } = req.body;
    await Book.findByIdAndUpdate(
      id,
      {
        $set: {
          title,
          description,
          genre,
          year,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Book Updated Successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const deleteBook = AsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (
      book.author.toString() != req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      throw new ErrorResponse("Not allowed to delete Book", 400);
    }
    await Book.findByIdAndDelete(id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Book deleted successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});
const getBooks = AsyncHandler(async (req, res) => {
  try {
    const { page, limit, keyword, year } = req.query;
    const query = {};
    if (keyword) {
      query.title = { $regex: new RegExp(keyword, "i") };
    }
    if (year) {
      query.year = { $lte: Number(year) };
    }
    const books = await Book.aggregate([
      {
        $match: query,
      },

      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
              },
            },
          ],
          as: "author",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          author: { $arrayElemAt: ["$author", 0] },
          genre: 1,
          year: 1,
        },
      },
      {
        $skip: (Number(page) - 1) * Number(limit),
      },
      {
        $limit: Number(limit),
      },
    ]);
    const totalPageCount = Math.ceil(
      (await Book.countDocuments()) / Number(limit)
    );
    const response = {
      books,
      page,
      limit,
      totalPageCount,
    };
    return res
      .status(200)
      .json(new ApiResponse(200, response, "Books fetched successfully"));
  } catch (error) {
    throw new ErrorResponse(error.message, 500);
  }
});

export { createBook, updateBook, deleteBook, getBooks };
