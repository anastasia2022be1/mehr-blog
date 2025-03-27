import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByCategory,
  getPostsByUser,
  updatePost,
  deletePost,
} from "../controllers/postControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new post (with thumbnail upload)
 * @access  Private
 */
router.post("/", authMiddleware, createPost);

/**
 * @route   GET /api/posts
 * @desc    Get all posts (sorted by updatedAt)
 * @access  Public
 */
router.get("/", getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
router.get("/:id", getPostById);

/**
 * @route   GET /api/posts/categories/:category
 * @desc    Get posts filtered by category
 * @access  Public
 */
router.get("/categories/:category", getPostsByCategory);

/**
 * @route   GET /api/posts/users/:id
 * @desc    Get all posts created by a specific user
 * @access  Public
 */
router.get("/users/:id", getPostsByUser);

/**
 * @route   PATCH /api/posts/:id
 * @desc    Update a post (optionally with new thumbnail)
 * @access  Private (creator only)
 */
router.patch("/:id", authMiddleware, updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post and remove thumbnail from storage
 * @access  Private (creator only)
 */
router.delete("/:id", authMiddleware, deletePost);

export default router;
