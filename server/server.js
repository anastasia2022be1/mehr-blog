import express from "express"
import cors from "cors";
import mongoose from "mongoose";

// await connect(); // MongoDB

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000

app.listen(port, () => console.log("Server started on port", port))