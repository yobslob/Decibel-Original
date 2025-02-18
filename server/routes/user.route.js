import express from "express";
import { followOrUnfollow, getProfile, getSuggestedUsers, login, signIn, updateProfile } from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post('/signin', signIn);
router.post('/login', login);

router.get('/:id', protectRoute, getProfile);
router.post('/profile', protectRoute, upload.single('profilePicture'), updateProfile);

router.post('/suggested', protectRoute, getSuggestedUsers);
router.post('/followorunfollow/:id', protectRoute, followOrUnfollow);

export default router;