import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import HttpError from '../models/errorModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';

// Define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
export const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body;

        // Validate required fields and thumbnail file
        if (!title || !description || !category || !req.files || !req.files.thumbnail) {
            return next(new HttpError('All fields are required', 422));
        }

        const { thumbnail } = req.files;

        // Validate thumbnail size (must be < 2MB)
        if (thumbnail.size > 2000000) {
            return next(new HttpError('Thumbnail too big. File should be less than 2MB', 422));
        }

        // Generate unique filename
        const fileName = thumbnail.name;
        const fileExtension = fileName.split('.').pop();
        const newFileName = `${uuidv4()}.${fileExtension}`;

        // Move file to uploads directory
        const uploadPath = path.join(__dirname, '..', 'uploads', newFileName);
        thumbnail.mv(uploadPath, async (err) => {
            if (err) {
                return next(new HttpError('Failed to upload thumbnail', 500));
            }

            try {
                // Create new post in database
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

                // Update user's post count
                const currentUser = await User.findById(req.user.id);
                if (currentUser) {
                    currentUser.posts = (currentUser.posts || 0) + 1;
                    await currentUser.save();
                }

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

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 */
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve posts', 500));
    }
};

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
export const getPostById = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve post', 500));
    }
};

/**
 * @swagger
 * /api/posts/categories/{category}:
 *   get:
 *     summary: Get posts by category
 *     tags: [Posts]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts in the category
 */
export const getPostsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const cateroryPosts = await Post.find({ category }).sort({ createdAt: -1 });

        res.status(200).json(cateroryPosts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve posts by category', 500));
    }
};

/**
 * @swagger
 * /api/posts/users/{id}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts by the user
 */
export const getPostsByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve user posts', 500));
    }
};

/**
 * @swagger
 * /api/posts/{id}:
 *   patch:
 *     summary: Update a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        // Validate input
        if (!title || !category || !description || description.length < 12) {
            return next(
                new HttpError('All fields are required. Description must be at least 12 characters long.', 422)
            );
        }

        // Find the post to update
        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            return next(new HttpError('Post not found', 404));
        }

        // Check authorization
        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError('You are not authorized to update this post', 403));
        }

        // If no new image, update only text fields
        if (!req.files || !req.files.thumbnail) {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { title, category, description },
                { new: true }
            );

            if (!updatedPost) {
                return next(new HttpError('Post not found', 404));
            }

            return res.status(200).json({ message: 'Post successfully updated', updatedPost });
        }

        // Delete old image if exists
        const oldFilePath = path.join(__dirname, '..', 'uploads', oldPost.thumbnail);
        if (fs.existsSync(oldFilePath)) {
            try {
                await fs.promises.unlink(oldFilePath);
            } catch (err) {
                console.error('Ошибка при удалении старого файла:', err);
            }
        }

        // Handle new thumbnail file
        const { thumbnail } = req.files;

        if (thumbnail.size > 2000000) {
            return next(new HttpError('Thumbnail size exceeds 2MB.', 400));
        }

        const fileName = thumbnail.name;
        const splittedFileName = fileName.split('.');
        const newFileName = `${splittedFileName[0]}_${uuidv4()}.${splittedFileName.pop()}`;

        const newFilePath = path.join(__dirname, '..', 'uploads', newFileName);
        await thumbnail.mv(newFilePath);

        // Update post in database
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, category, description, thumbnail: newFileName },
            { new: true }
        );

        if (!updatedPost) {
            return next(new HttpError('Post not found', 404));
        }

        res.status(200).json({ message: 'Post successfully updated', updatedPost });
    } catch (error) {
        console.error('Update Post Error:', error);
        return next(new HttpError(error.message || 'Could not update the post', 500));
    }
};

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        // Validate that a post ID was provided
        if (!postId) {
            return next(new HttpError('Post ID is required', 400));
        }

        // Retrieve the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError('Post not found', 404));
        }

        // Check if the logged-in user is the creator of the post
        if (req.user.id !== post.creator.toString()) {
            return next(new HttpError('Post could not be deleted', 403));
        }

        // Delete the thumbnail file if it exists
        const fileName = post?.thumbnail;
        if (fileName) {
            try {
                fs.unlink(path.join(__dirname, '..', 'uploads', fileName), (err) => {
                    if (err) {
                        console.error("File deletion error details:", err);
                        return next(new HttpError("Error deleting the thumbnail file", 500));
                    }
                });

            } catch (err) {
                return next(new HttpError('Error deleting the thumbnail file', 500));
            }
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(postId);

        // Decrement the user's post count
        await User.findByIdAndUpdate(req.user.id, { $inc: { posts: -1 } });

        // Respond with success
        res.status(200).json({ message: `Post ${postId} deleted successfully` });
    } catch (error) {
        // Handle unexpected errors
        return next(new HttpError(error.message || 'Could not delete the post', 500));
    }
};


