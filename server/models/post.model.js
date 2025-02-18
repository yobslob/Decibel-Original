import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;