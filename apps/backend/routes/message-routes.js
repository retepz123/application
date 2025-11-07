import express from 'express';
import { getMessage, sendMessage } from '../controllers/message-controller.js';
import { protectedMiddleware } from '../middleware/protected-middleware.js';

const router = express.Router();

router.get('/:senderId/:receiverId', protectedMiddleware, getMessage);
router.post('/send', protectedMiddleware, sendMessage);



export default router;