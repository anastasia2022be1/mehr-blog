import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

import { notFound, errorMiddleware } from './middleware/errorMiddleware.js'

dotenv.config();

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();

// Воссоздаем __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
// https://mehr-blog-2.onrender.com

app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// Middleware для обработки несуществующих маршрутов
app.use(notFound);

// Middleware для обработки ошибок
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
