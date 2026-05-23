import { Router } from 'express';
import * as roomTypeController from '../controllers/roomTypeController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', roomTypeController.getAll);
router.get('/:id', roomTypeController.getById);
router.post('/', authenticate, roomTypeController.create);
router.put('/:id', authenticate, roomTypeController.update);
router.delete('/:id', authenticate, roomTypeController.remove);

export default router;
