import express from "express";

import { registerUser, loginUser, getUser, editUser, getAuthors, changeAvatar } from '../controllers/userControllers.js'

const router = express.Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get('/:id', getUser)

router.get('/', getAuthors)

router.post('/change-avatar', changeAvatar)

router.patch('edit-user', editUser)


export default router;