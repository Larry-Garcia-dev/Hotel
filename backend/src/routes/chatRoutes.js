import { Router } from 'express';
import * as chatController from '../controllers/chatController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.post('/start', chatController.startSession);
router.post('/message', chatController.sendMessage);
router.get('/history/:sessionId', chatController.getHistory);
router.post('/end/:sessionId', chatController.endSession);

// Admin routes
router.get('/admin/sessions', authenticate, chatController.getAllChats);

export default router;
