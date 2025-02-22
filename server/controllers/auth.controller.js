import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../config/cloudinary.js";


export const signIn = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Missing values!\nPlease provide valid credentials.",
                success: false
            });
        }
        const user = (await User.findOne({ email }) || (await User.findOne({ username })));
        if (user) {
            return res.status(409).json({
                message: "User already logged in!\nPlease logout from other device or use another account.",
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({
            message: "Signed-in successfuly!",
            success: true
        });
    } catch (error) {
        console.error("sign-up error: ", error);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Incorrect email or password!\nPlease provide valid credentials.",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return res.status(401).json({
                message: "Invalid Password, Please try again.",
                success: false
            });
        }

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: `Logged in Successfully.\nWelcome back, ${user.username}`,
            success: true,
            user,
        });

    } catch (error) {
        console.error("login error: ", error);
    }
}

export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ msg: "logged out succesfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getProfile = async (req, res) => {
    try {
        const uid = req.params.id;
        let user = await User.findById(uid);
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        res.status(404).json({
            message: "User not found.",
            success: false,
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        const { bio, gender } = req.body;
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        const profilePicture = req.file;
        let cloudResponse;
        if (profilePicture) {
            const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
            if (profilePicture && !allowedFormats.includes(profilePicture.mimetype)) {
                return res.status(400).json({
                    message: "Invalid file format. Only JPEG and PNG are allowed.",
                    success: false,
                });
            }
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
            if (!cloudResponse || !cloudResponse.secure_url) {
                return res.status(500).json({
                    message: "Failed to upload profile picture.",
                    success: false,
                });
            }
            user.profilePicture = cloudResponse.secure_url;
        }
        if (!bio && !gender && !profilePicture) {
            return res.status(400).json({
                message: "No fields provided for update.",
                success: false,
            });
        }

        await user.save();

        return res.status(201).json({
            user,
            message: "Profile updated.",
            success: true
        })
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            message: "Server error while updating profile.",
            success: false,
        });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (suggestedUsers === 0) {
            return res.status(404).json({
                message: "No current suggested users.",
            });
        }
        res.status(200).json({
            users: suggestedUsers,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while finding users.",
            success: false,
        });
    }
}

export const followOrUnfollow = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
        const targetUser = await User.findById(req.params.id);

        if (!req.user._id || !req.params.id) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        } else if (user === targetUser) {
            return res.status(400).json({
                message: "You can not follow/Unfollow yourself.",
                success: false,
            });
        }

        const isFollowing = user.following?.includes(req.params.id);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: req.user._id }, { $pull: { following: req.params.id } }),
                User.updateOne({ _id: req.params.id }, { $pull: { followers: req.user._id } })
            ]);
            res.status(200).json({
                message: "Unfollowed Successfully.",
                success: true,
            });
        } else {
            await Promise.all([
                User.updateOne({ _id: req.user._id }, { $push: { following: req.params.id } }),
                User.updateOne({ _id: req.params.id }, { $push: { followers: req.user._id } })
            ]);
            res.status(200).json({
                message: "Followed Successfully.",
                success: true,
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Button is not responding.",
            success: false,
        });
    }
}