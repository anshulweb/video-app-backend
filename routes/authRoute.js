import express from 'express';
import { googleAuth, signin, signup } from '../controllers/AuthController.js';

const router = express.Router();

//SIGNUP
router.post('/signup', signup);
//SIGNIN
router.post('/signin', signin);
//GOOGLE
router.post('/google', googleAuth);
export default router;
