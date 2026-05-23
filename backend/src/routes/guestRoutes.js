import { Router } from 'express';
import * as guestController from '../controllers/guestController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, guestController.getAll);
router.get('/:id', authenticate, guestController.getById);
router.post('/', guestController.create);
router.put('/:id', authenticate, guestController.update);
router.delete('/:id', authenticate, guestController.remove);

export default router;
