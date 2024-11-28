import express from "express";
// import multer from "multer";

import authMiddleware from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar } from '../controllers/userControllers.js'

const router = express.Router();

// const upload = multer({
//     dest: 'uploads/', // Папка для временного хранения
//     limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (5 MB)
// });


// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/:id', getUser);  // Use GET for profile

// Change user avatar
// router.post('/change-avatar', authMiddleware, upload.single('profilePicture'), changeAvatar);
router.post('/change-avatar', authMiddleware, changeAvatar);

// Edit user details
router.patch('/edit-user', authMiddleware, editUser);  // Use PUT for editing user details

// Get all authors (no authentication required)
router.get('/', getAuthors);  // Use GET for authors


export default router;