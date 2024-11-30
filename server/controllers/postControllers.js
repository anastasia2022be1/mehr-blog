import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
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
        const posts = await Post.find().sort({ updateAt: -1 });
        res.status(200).json(posts);
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

        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve post', 500));
    }
};

// Получение постов по категории
export const getPostsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const cateroryPosts = await Post.find({ category }).sort({ createAt: -1 });

        res.status(200).json(cateroryPosts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve posts by category', 500));
    }
};

// Получение постов пользователя
export const getPostsByUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ creator: id }).sort({ createAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error.message || 'Could not retrieve user posts', 500));
    }
};

// Обновление поста
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, description } = req.body;

        // Проверка входных данных
        if (!title || !category || !description || description.length < 12) {
            return next(
                new HttpError('All fields are required. Description must be at least 12 characters long.', 422)
            );
        }

        const oldPost = await Post.findById(postId);
        if (!oldPost) {
            return next(new HttpError('Post not found', 404));
        }

        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError('You are not authorized to update this post', 403));
        }

        // Если файл не предоставлен, обновляем только текстовые поля
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

        // Удаление старого файла, если существует
        const oldFilePath = path.join(__dirname, '..', 'uploads', oldPost.thumbnail);
        if (fs.existsSync(oldFilePath)) {
            try {
                await fs.promises.unlink(oldFilePath);
            } catch (err) {
                console.error('Ошибка при удалении старого файла:', err);
            }
        }

        // Работа с новым файлом
        const { thumbnail } = req.files;

        // Проверка размера файла
        if (thumbnail.size > 2000000) {
            return next(new HttpError('Thumbnail size exceeds 2MB.', 400));
        }

        // Генерация уникального имени файла
        const fileName = thumbnail.name;
        const splittedFileName = fileName.split('.');
        const newFileName = `${splittedFileName[0]}_${uuidv4()}.${splittedFileName.pop()}`;

        // Сохранение нового файла
        const newFilePath = path.join(__dirname, '..', 'uploads', newFileName);
        await thumbnail.mv(newFilePath);

        // Обновление поста с новым файлом
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
        console.error('Ошибка при обновлении поста:', error);
        return next(new HttpError(error.message || 'Could not update the post', 500));
    }
};

// export const updatePost = async (req, res, next) => {
//     try {
//         const postId = req.params.id;
//         const { title, category, description } = req.body;

//         // Проверка входных данных
//         if (!title || !category || !description || description.length < 12) {
//             return next(new HttpError('All fields are required. Description must be at least 12 characters long.', 404));
//         }

//         // Если файл не предоставлен
//         if (!req.files || !req.files.thumbnail) {
//             const updatedPost = await Post.findByIdAndUpdate(
//                 postId,
//                 { title, category, description },
//                 { new: true }
//             );

//             if (!updatedPost) {
//                 return next(new HttpError('Post not found', 404));
//             }

//             return res.status(200).json({ message: 'Post successfully updated', updatedPost });
//         }

//         // Работа с файлами
//         const oldPost = await Post.findById(postId);
//         if (!req.files) {

//         }
//         if (!oldPost) {
//             return next(new HttpError('Post not found', 404));
//         }

//         if (req.user.id !== oldPost.creator.toString()) {
//             return next(new HttpError('Post could not be deleted', 403));
//         }

//         // Удаление старого файла
//         fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
//             if (err) {
//                 return next(new HttpError('Error deleting the old thumbnail file', 500));
//             }
//         });

//         // Проверка размера нового файла
//         const { thumbnail } = req.files;
//         if (thumbnail.size > 2000000) {
//             return next(new HttpError('Thumbnail size exceeds 2MB.', 400));
//         }

//         // Генерация уникального имени файла
//         const fileName = thumbnail.name;
//         const splittedFileName = fileName.split('.');
//         const newFileName = `${splittedFileName[0]}_${uuidv4()}.${splittedFileName.pop()}`;

//         // Сохранение нового файла
//         thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
//             if (err) {
//                 return next(new HttpError('Error uploading the new thumbnail', 500));
//             }
//         });

//         // Обновление поста в базе данных
//         const updatedPost = await Post.findByIdAndUpdate(
//             postId,
//             { title, category, description, thumbnail: newFileName },
//             { new: true }
//         );

//         if (!updatedPost) {
//             return next(new HttpError('Post not found', 404));
//         }

//         res.status(200).json({ message: 'Post successfully updated', updatedPost });
//     } catch (error) {
//         return next(new HttpError(error.message || 'Could not update the postт', 500));
//     }
// };

// Удаление поста
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
                        // console.error("Детали ошибки при удалении файла:", err);
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


