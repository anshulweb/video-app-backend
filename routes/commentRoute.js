import express from 'express';
import { verifyToken } from '../../server/verifyToken.js';
import {
  addComment,
  deleteComment,
  getComments,
} from '../controllers/CommentController.js';
const router = express.Router();

//ADD COMMENT
router.post('/save', verifyToken, addComment);
//DELETE COMMENT
router.delete('/:id', verifyToken, deleteComment);
//GET COMMENT
router.get('/:videoId', verifyToken, getComments);
export default router;
