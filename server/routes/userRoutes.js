import express from "express";

import { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar } from '../controllers/userControllers.js'

const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/:id', getUser);  // Use GET for profile

// Change user avatar
router.post('/change-avatar', changeAvatar);

// Edit user details
router.patch('/edit-user', editUser);  // Use PUT for editing user details

// Get all authors (no authentication required)
router.get('/', getAuthors);  // Use GET for authors


export default router;