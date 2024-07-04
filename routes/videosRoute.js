import express from 'express';
import { verifyToken } from '../verifyToken.js';
import {
  addVideo,
  addView,
  deleteVideo,
  getByTag,
  getVideo,
  random,
  search,
  sub,
  trend,
  updateVideo,
} from '../controllers/VideoController.js';
const router = express.Router();

//ADD VIDEO
router.post('/add-video', verifyToken, addVideo);
//UPDATE Video
router.put('/:id', verifyToken, updateVideo);
//DELETE Video
router.delete('/delete/:id', verifyToken, deleteVideo);
//GET Video
router.get('/find/:id', getVideo);
//GET Video
router.put('/views/:id', verifyToken, addView);
//GET Video
router.get('/trend', trend);
//GET Video
router.get('/random', random);
//GET Video
router.get('/sub', verifyToken, sub);
router.get('/tags', getByTag);
router.get('/search', search);
export default router;
