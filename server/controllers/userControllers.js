import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import HttpError from "../models/errorModel.js"
import User from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//--------------------------------------------------------

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

        console.log("Received user data:", req.body);
        // Hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name,
            email: newEmail,
            password: hashedPassword
        })

        console.log("New user created:", newUser);
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
            return next(new HttpError('Email not found', 422))
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
            return res.status(401).json({ error: 'Wrong password' });
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
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            new HttpError('User not found', 404)
        }

        res.status(200).json(user)

    } catch (error) {
        return next(new HttpError('An error occurred while fetching the user', 500));

    }
}

//----------------------------------------------

// change user avatar
// POST: api/users/change-avatar
// protected

// изменение аватара пользователя
// POST: api/users/change-avatar
// защищено

export const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("No file uploaded", 400));  // Возвращаем ошибку, если файл не передан
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found', 404));  // Возвращаем ошибку, если пользователь не найден
        }

        // Удаляем старый аватар
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError('Failed to delete old avatar', 500));  // Обработка ошибки при удалении старого аватара
                }
            });
        }

        const { avatar } = req.files;

        // Проверка размера файла
        if (avatar.size > 500000) {  // Ограничение на размер файла 500KB
            return next(new HttpError('Profile picture is too large, max 500KB allowed', 400));
        }

        let fileName = avatar.name;
        let splittedFileName = fileName.split('.');
        let newFileName = splittedFileName[0] + uuidv4() + '.' + splittedFileName[splittedFileName.length - 1]; // Генерация уникального имени для файла

        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError('Failed to upload avatar', 500));  // Ошибка при загрузке аватара
            }

            // Обновляем информацию о пользователе с новым аватаром
            const updatedAvatar = await User.findByIdAndUpdate(
                req.user.id,
                { avatar: newFileName },
                { new: true }
            );

            if (!updatedAvatar) {
                return next(new HttpError('Avatar couldn\'t be updated', 422));  // Ошибка при обновлении аватара
            }

            res.status(200).json(updatedAvatar);  // Отправляем обновленные данные пользователя с новым аватаром
        });
    } catch (error) {
        return next(new HttpError(error.message, 500));  // Ошибка в процессе выполнения
    }
};




//--------------------------------------------------

// edit user details
// POST: api/users/edit-user

export const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, newConfirmPassword } = req.body;

        // Проверка обязательных полей
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError('Please fill in all fields', 422));
        }

        // Получение пользователя из базы данных
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found', 403));
        }

        // Проверка уникальности email
        const emailExist = await User.findOne({ email });
        if (emailExist && emailExist._id.toString() !== req.user.id) {
            return next(new HttpError('Email already exists', 422));
        }

        // Проверка текущего пароля
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError('Invalid current password', 422));
        }

        // Проверка совпадения нового пароля и подтверждения
        if (newPassword !== newConfirmPassword) {
            return next(new HttpError('New passwords do not match', 422));
        }

        // Обновление данных пользователя
        user.name = name;
        user.email = email;
        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Сохранение изменений
        await user.save();

        // Успешный ответ
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        return next(new HttpError(error.message || 'Something went wrong', 500));
    }
};


//-------------------------------------

// edit user details
// POST: api/users/authors
// unprotected


export const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.json(authors)
    } catch (error) {
        return next(new HttpError(error))
    }
}