import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        maxLength: 200,
    },
    gender: {
        type: String,
        enum: [
            'male', 'female'
        ]
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

// Export User model
export const User = mongoose.model("User", userSchema);