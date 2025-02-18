import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export const generateToken = (userId) => {
    try {
        return jwt.sign({ uid: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    } catch (error) {
        console.log("Token assigning error: ", error);
        res.status(401).json({
            message: "Token assignment failed.",
            success: false,
        })
    }

}