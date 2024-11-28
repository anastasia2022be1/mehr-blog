import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByCategory,
    getPostsByUser,
    updatePost,
    deletePost,
} from '../controllers/postControllers.js';

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost); // Создать пост
router.get("/", getAllPosts); // Получить все посты
router.get("/:id", getPostById); // Получить пост по ID
router.get("/categories/:category", getPostsByCategory); // Получить посты по категории
router.get("/users/:id", getPostsByUser); // Получить посты пользователя (изменено)
router.patch("/:id", authMiddleware, updatePost); // Обновить пост
router.delete("/:id", authMiddleware, deletePost); // Удалить пост

export default router;
