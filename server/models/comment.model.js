import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        trim: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;