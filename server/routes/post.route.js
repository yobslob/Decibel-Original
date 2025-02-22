import express from "express";
import upload from "../middlewares/multer.js";
import protectRoute from "../middlewares/protectRoute.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getComments, getFeed, getPosts, likePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/new', protectRoute, upload.single('image'), addNewPost);
router.delete('/:id', protectRoute, deletePost);

router.get('/feed', getFeed);
router.get('/user/:id', getPosts);

router.put('/like/:id', protectRoute, likePost);
router.put('/dislike/:id', protectRoute, dislikePost);

router.post('/comment/:id/new', protectRoute, addComment);
router.get('/comment/:id', getComments);

router.put('/bookmark/:id', protectRoute, bookmarkPost);

export default router;