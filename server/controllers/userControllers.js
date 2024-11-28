import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import HttpError from "../models/errorModel.js"
import User from "../models/userModel.js";

// register a new user
// POST: api/users/register

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password) {
            return next(new HttpError('Fill in all fields', 422))
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError('Email already exists', 422))
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError('Password should be at least 6 characters', 422))
        }

        if (password != password2) {
            return next(new HttpError('Passwords do not match', 422))
        }

        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: newEmail,
            password: hashedPassword
        })

        res.status(201).json(`newUser ${newUser.email} registered`)

    } catch (error) {
        return next(new HttpError('User registartion failed', 422))
    }
}

//-----------------------------------------------------

// login user
// POST: api/users/login

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError('Fill in all fields', 422))
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail })

        if (!user) {
            return next(new HttpError('Invalid credentials', 422))
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { _id: id, name } = user;

        const token = jwt.sign({ email, id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.status(200).json({ token, id, name })


    } catch (error) {
        return next(new HttpError('Login failed. Please check your credentials', 422))
    }
}

//-----------------------------------

//user profile
// POST: api/users/:id
// protected

export const getUser = async (req, res, next) => {
    res.json('User profile')
}

//----------------------------------------------

// change user avatar
// POST: api/users/change-avatar
// protected

export const changeAvatar = async (req, res, next) => {
    res.json('Change user avatar')
}

//--------------------------------------------------

// edit user details
// POST: api/users/edit-user

export const editUser = async (req, res, next) => {
    res.json('Edit user details')
}

//-------------------------------------

// edit user details
// POST: api/users/authors
// unprotected


export const getAuthors = async (req, res, next) => {
    res.json('All authors')
}