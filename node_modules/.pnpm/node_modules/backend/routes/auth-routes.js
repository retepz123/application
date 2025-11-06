import express from 'express';
import { validateSignUp } from '../middleware/signUp-middleware.js';
import { signUp } from '../controllers/signup-controller.js';
import { authLogin } from '../middleware/login-middleware.js';
import { getAllUser, login } from '../controllers/login-controller.js';
import { protectedMiddleware } from '../middleware/protected-middleware.js';

const router = express.Router();

router.post('/register', validateSignUp, signUp);
router.post('/login', authLogin, login);
router.get('/allUsers', protectedMiddleware, getAllUser);

export default router;