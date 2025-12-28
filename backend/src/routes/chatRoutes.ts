import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All chat routes require authentication
router.use(authenticateToken);

router.post('/:requestId', ChatController.sendMessage);
router.get('/:requestId', ChatController.getMessages);

export default router;
