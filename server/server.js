import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

import { notFound, errorMiddleware } from './middleware/errorMiddleware.js'

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// Middleware для обработки несуществующих маршрутов
app.use(notFound);

// Middleware для обработки ошибок
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
