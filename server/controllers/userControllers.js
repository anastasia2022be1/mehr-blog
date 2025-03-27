import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";

import HttpError from "../models/errorModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - password2
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               password2:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       422:
 *         description: Validation error
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();

    // Check if email already exists
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }

    // Validate password length
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters", 422)
      );
    }

    // Check if passwords match
    if (password != password2) {
      return next(new HttpError("Passwords do not match", 422));
    }

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name,
      email: newEmail,
      password: hashedPassword,
    });

    res.status(201).json(`newUser ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("User registartion failed", 422));
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and return token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized - wrong password
 *       422:
 *         description: Validation error
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(new HttpError("Fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Email not found", 422));
    }

    // Compare passwords
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Wrong password" });
    }

    // Generate JWT token
    const { _id: id, name } = user;
    const token = jwt.sign({ email, id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials", 422)
    );
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Exclude password field
    const user = await User.findById(id).select("-password");
    if (!user) {
      new HttpError("User not found", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    return next(
      new HttpError("An error occurred while fetching the user", 500)
    );
  }
};

/**
 * @swagger
 * /api/users/change-avatar:
 *   post:
 *     summary: Upload or update user's avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file (max 500KB)
 *     responses:
 *       200:
 *         description: Avatar successfully updated
 *       400:
 *         description: No file uploaded or file too large
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Update failed
 */
export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("No file uploaded", 400)); // Возвращаем ошибку, если файл не передан
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 404)); // Возвращаем ошибку, если пользователь не найден
    }

    // Delete old avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError("Failed to delete old avatar", 500));
        }
      });
    }

    const { avatar } = req.files;

    // Validate file size
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profile picture is too large, max 500KB allowed", 400)
      );
    }

    // Generate unique filename
    let fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuidv4() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    // Move file to uploads
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError("Failed to upload avatar", 500));
        }

        // Update user with new avatar
        const updatedAvatar = await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newFileName },
          { new: true }
        );

        if (!updatedAvatar) {
          return next(new HttpError("Avatar couldn't be updated", 422));
        }

        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

/**
 * @swagger
 * /api/users/edit-user:
 *   patch:
 *     summary: Update user profile (name, email, password)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - currentPassword
 *               - newPassword
 *               - newConfirmPassword
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               newConfirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: User not found
 *       422:
 *         description: Validation or update error
 */
export const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, newConfirmPassword } =
      req.body;

    // Validate required fields
    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError("Please fill in all fields", 422));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User not found", 403));
    }

    // Check if email is already used by another user
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError("Email already exists", 422));
    }

    // Validate current password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password", 422));
    }

    // Check new password confirmation
    if (newPassword !== newConfirmPassword) {
      return next(new HttpError("New passwords do not match", 422));
    }

    // Update user data
    user.name = name;
    user.email = email;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    return next(new HttpError(error.message || "Something went wrong", 500));
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all authors with their post counts
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
export const getAuthors = async (req, res, next) => {
  try {
    // Get all users (excluding passwords)
    const users = await User.find().select("-password");

    // Count posts for each user
    const usersWithPostCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Post.countDocuments({ creator: user._id });
        return {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          posts: count,
        };
      })
    );

    res.json(usersWithPostCounts);
  } catch (error) {
    return next(new HttpError(error.message));
  }
};
