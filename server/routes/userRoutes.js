import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUser,
  editUser,
  getAuthors,
  changeAvatar,
} from "../controllers/userControllers.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user profile by ID
 * @access  Public
 */
router.get("/:id", getUser);

/**
 * @route   POST /api/users/change-avatar
 * @desc    Upload or change user avatar
 * @access  Private
 */
router.post("/change-avatar", authMiddleware, changeAvatar);

/**
 * @route   PATCH /api/users/edit-user
 * @desc    Update user name, email, or password
 * @access  Private
 */
router.patch("/edit-user", authMiddleware, editUser);

/**
 * @route   GET /api/users
 * @desc    Get all authors with post count
 * @access  Public
 */
router.get("/", getAuthors);

export default router;
