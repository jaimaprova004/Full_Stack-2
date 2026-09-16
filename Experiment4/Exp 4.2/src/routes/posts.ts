import { Router } from 'express';
import { createPost, deletePost, getAllPosts, updatePost } from '../controllers/posts';

const router = Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
