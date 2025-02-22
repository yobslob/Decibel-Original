import express, { urlencoded } from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";


configDotenv();

const PORT = process.env.PORT || 3000;

const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute)
app.use('/api/v1/message', messageRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
}).catch((error) => {
    console.log("Connection error : ", error);
})

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Server is working!",
        success: true
    })
})