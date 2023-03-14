import express from "express";
import multer from "multer";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById,
} from "../controllers/service.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
import {
	validateService,
	validateServiceWithID,
} from "../validates/service.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route GET api/service
// @desc Get all services
// @access Private
router.get("/", verifyToken, verifyAdmin, getAll);

// @route GET api/service/:id
// @desc Get service by id
// @access Private
router.get("/:id", verifyToken, getById);

// @route POST api/service
// @desc Create a new service
// @access Private
router.post(
	"/",
	upload.single("service"),
	verifyToken,
	verifyAdmin,
	validateService,
	create
);

// @route PATCH api/service/:id
// @desc Update service by id
// @access Private
router.patch(
	"/:id",
	upload.single("service"),
	verifyToken,
	verifyAdmin,
	validateServiceWithID,
	updateById
);

// @route DELETE api/service
// @desc Delete all services
// @access Private
router.delete("/", verifyToken, verifyAdmin, deleteAll);

// @route DELETE api/service/:id
// @desc Delete service by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteById);

export default router;