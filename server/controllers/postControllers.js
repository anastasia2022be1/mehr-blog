import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import HttpError from '../models/errorModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создание поста

export const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;

        // Проверка обязательных полей
        if (!title || !description || !category || !req.files || !req.files.thumbnail) {
            return next(new HttpError('All fields are required', 422));
        }

        const { thumbnail } = req.files;

        // Проверка размера файла
        if (thumbnail.size > 2000000) {
            return next(new HttpError('Thumbnail too big. File should be less than 2MB', 422));
        }

        // Генерация уникального имени файла
        const fileName = thumbnail.name;
        const fileExtension = fileName.split('.').pop();
        const newFileName = `${uuidv4()}.${fileExtension}`;

        // Перемещение файла в папку uploads
        const uploadPath = path.join(__dirname, '..', 'uploads', newFileName);
        thumbnail.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError('Failed to upload thumbnail', 500));
            }

            try {
                // Создание нового поста
                const newPost = await Post.create({
                    title,
                    description,
                    category,
                    thumbnail: newFileName,
                    creator: req.user.id,
                });

                if (!newPost) {
                    return next(new HttpError('Could not create post', 422));
                }

                // Обновление количества постов пользователя
                const currentUser = await User.findById(req.user.id);
                if (currentUser) {
                    currentUser.posts = (currentUser.posts || 0) + 1;
                    await currentUser.save();
                }

                // Успешный ответ
                res.status(201).json({
                    message: 'Post created successfully',
                    post: newPost,
                });
            } catch (error) {
                return next(new HttpError(error.message || 'Could not create post', 500));
            }
        });
    } catch (error) {
        return next(new HttpError(error.message || 'Could not create post', 500));
    }
};


// Получение всех постов
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve posts', 500));
    }
};

// Получение поста по ID
export const getPostById = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        res.json(post);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve post', 500));
    }
};

// Получение постов по категории
export const getPostsByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const posts = await Post.find({ category });

        res.json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve posts by category', 500));
    }
};

// Получение постов пользователя
export const getPostsByUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({ userId });

        res.json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve user posts', 500));
    }
};

// Обновление поста
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, content, category } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.category = category || post.category;

        await post.save();

        res.json({ message: 'Post updated successfully', post });
    } catch (error) {
        return next(new HttpError(error.message || 'Could not update post', 500));
    }
};

// Удаление поста
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return next(new HttpError(error.message || 'Could not delete post', 500));
    }
};


