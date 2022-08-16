import express from 'express'
import { createPost, deletePost, getPost, getTimelinePost, postLike, updatePost } from '../Controllers/PostsController.js';
const router = express.Router()

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', postLike)
router.get('/:id/timeline', getTimelinePost)

export default router;