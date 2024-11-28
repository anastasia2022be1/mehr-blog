import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import multer from "multer";
import fileUpload from "express-fileupload";
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

import { notFound, errorMiddleware } from './middleware/errorMiddleware.js'

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
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(fileUpload());
app.use('/upload', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// Middleware для обработки несуществующих маршрутов
app.use(notFound);

// Middleware для обработки ошибок
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
