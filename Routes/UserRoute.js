import express from 'express'
import { deleteUser, getAllUser, getUser, updateUser, userFollow, userUnfollow } from '../Controllers/UserController.js';


const router = express.Router();

router.get('/', getAllUser);
router.get('/:id', getUser);
router.put('/:id', updateUser)
router.delete('/:id', deleteUser);
router.put('/:id/follow', userFollow)
router.put('/:id/unfollow', userUnfollow)

export default router