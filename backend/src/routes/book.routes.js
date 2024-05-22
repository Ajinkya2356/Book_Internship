import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/").post(verifyJWT, bookController.createBook);
router.route("/:id").put(verifyJWT, bookController.updateBook);
router.route("/:id").delete(verifyJWT, bookController.deleteBook);
router.route("/").get(bookController.getBooks);
export default router;
