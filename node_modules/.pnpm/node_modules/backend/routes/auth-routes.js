import express from 'express';
import { validateSignUp } from '../middleware/signUp-middleware.js';
import { signUp } from '../controllers/signup-controller.js';
import { authLogin } from '../middleware/login-middleware.js';
import { login } from '../controllers/login-controller.js';

const router = express.Router();

router.post('/register', validateSignUp, signUp);
router.post('/login', authLogin, login);

export default router;