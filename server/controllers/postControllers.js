import HttpError from '../models/errorModel.js';
import postModel from '../models/postModel.js'

// Создание поста
export const createPost = async (req, res, next) => {
    try {
        const { title, content, category, userId } = req.body;

        if (!title || !content || !category || !userId) {
            return next(new HttpError('All fields are required', 422));
        }

        const newPost = new Post({
            title,
            content,
            category,
            userId,
        });

        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
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

