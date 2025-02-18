import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;


        if (!token) {
            return res.status(401).json({
                message: "Unauthorized entity - No token provided.",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized access - Invalid token.",
                success: false
            });
        }

        const user = await User.findById(decoded.uid).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again.",
                success: false
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token. Please authenticate again.",
                success: false
            });
        }
        res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
export default protectRoute;