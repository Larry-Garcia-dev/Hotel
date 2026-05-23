import { Router } from 'express';
import * as roomController from '../controllers/roomController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', roomController.getAll);
router.get('/availability', roomController.checkAvailability);
router.get('/:id', roomController.getById);
router.post('/', authenticate, roomController.create);
router.put('/:id', authenticate, roomController.update);
router.delete('/:id', authenticate, roomController.remove);

export default router;
