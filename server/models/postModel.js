import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: {
            type: String,
            enum: {
                values: ['Travel', 'Fitness', 'Food', 'Parenting', 'Beauty', 'Photography', 'Art', 'Writing', 'Music', 'Book'],
                message: "{VALUE} is not a supported category" 
            },
            required: true
        },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    },
    { timestamps: true } 
);

const Post = mongoose.model("Post", postSchema);
export default Post;
