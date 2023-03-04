import express from "express";
import multer from "multer";
import { create } from "../controllers/user.js";
import { validateUser } from "../validates/user.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route POST api/user
// @desc Create a new user
// @access Private
router.post("/", upload.single("avatar"), validateUser, create);

export default router;