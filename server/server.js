import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
