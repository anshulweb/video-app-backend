import express from 'express';
import {
  deleteUser,
  deslike,
  getUser,
  like,
  subscribe,
  unsubscribe,
  updateUser,
} from '../controllers/UserController.js';
import { verifyToken } from '../verifyToken.js';

const router = express.Router();

//UPDATE USER
router.put('/:id', verifyToken, updateUser);
//DELETE USER
router.delete('/delete/:id', verifyToken, deleteUser);
//GET USER
router.get('/find/:id', getUser);
//SUBSCRIBE USER
router.put('/subscribe/:id', verifyToken, subscribe);
//UNSUBSCRIBE USER
router.put('/unsubscribe/:id', verifyToken, unsubscribe);
//LIKE USER
router.put('/like/:videoId', verifyToken, like);
//DESLIKE USER
router.put('/dislike/:videoId', verifyToken, deslike);

export default router;
