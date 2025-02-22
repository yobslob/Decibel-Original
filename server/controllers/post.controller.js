import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.user._id.toString();

        if (!image) {
            return res.status(404).json({
                message: "Image not found",
                success: false
            });
        }

        //high-quality image upload
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption: caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        } else {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        await post.populate({
            path: 'author',
            select: '-password'
        });

        return res.status(201).json({
            message: "Post added successfully.",
            post,
            success: true
        });


    } catch (error) {
        console.error("Error in image handling.", error);
        return res.status(400).json({
            Message: "Post not added.",
            success: false
        });
    }
}

export const getFeed = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error("error in retreiving User's feed : ", error);
        return res.status(400).json({
            message: "Can not access User's feed.",
            success: false
        });
    }
}

export const getPosts = async (req, res) => {
    try {
        const authorId = req.params.id;
        if (!authorId) {
            return res.status(400).json({
                message: "User ID not provided.",
                success: false
            });
        }
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error("error in getting User's posts : ", error);
        return res.status(400).json({
            message: "Can not access User's posts.",
            success: false
        });
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: "Post not found.",
            success: false
        });

        if (post.likes.includes(userId)) {
            return res.status(400).json({
                message: "User already liked this post.",
                success: false
            });
        }

        //like logic (new : true updates in the database instead of post.save())
        await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

        //real time notif socket.io

        return res.status(200).json({
            message: "Post liked.",
            success: true
        });

    } catch (error) {
        console.error("error while liking the post.", error);
        return res.status(400).json({
            message: "Could not like User's post.",
            success: false
        });

    }
}
export const dislikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({
            message: "Post not found.",
            success: false
        });

        if (!post.likes.includes(userId)) {
            return res.status(400).json({
                message: "User has not liked the post.",
                success: false
            });
        }

        //dislike logic
        await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

        //real time notif socket.io


        return res.status(200).json({
            message: "Post unliked.",
            success: true
        });

    } catch (error) {
        console.error("error while unliking the post.", error);
        return res.status(400).json({
            message: "Could not unlike User's post.",
            success: false
        });
    }
}
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commenterId = req.user._id.toString();
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                message: "No valid text found.",
                success: false
            });
        }
        const comment = await Comment.create({
            author: commenterId,
            text: text,
            post: postId
        })

        await comment.populate({
            path: 'author',
            select: "username , profilePicture"
        });
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            });
        }
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "New comment added.",
            success: true
        });

    } catch (error) {
        console.error("Error while adding comment : ", error);
        return res.status(400).json({
            message: "Could not add User's comment.",
            success: false
        })

    }
}
export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate({
            path: 'author',
            select: "username profilePicture"
        });
        if (comments.length === 0) {
            return res.status(404).json({
                message: "No comments found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Fetched all comments.",
            success: true,
            comments
        });

    } catch (error) {
        console.error("Error while fetching comments.", error);
        return res.status(400).json({
            message: "Error while fetching comments.",
            success: false
        });
    }
}
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            });
        }

        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "Action Forbidden by Server.",
                success: false
            });
        }

        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Post.findByIdAndDelete(postId);
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted successfully.",
            success: true
        });

    } catch (error) {
        console.log("Error while deleting post : ", error);
        return res.status(500).json({
            message: "Internal server error while deleting post.",
            success: false
        });
    }
}
export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found.",
                success: false
            })
        }
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: postId } });
            await user.save();

            return res.status(200).json({
                type: 'unsaved',
                message: "Post is unbookmarked.",
                success: true
            });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: postId } });
            await user.save();

            return res.status(200).json({
                type: 'saved',
                message: "Post is bookmarked.",
                success: true
            });
        }
    } catch (error) {
        console.error("error while marking the post : ", error);
        return res.status(500).json({
            message: "Error while bookmarking post.",
            success: false
        });

    }
}