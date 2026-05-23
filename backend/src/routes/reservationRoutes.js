import { Router } from 'express';
import * as reservationController from '../controllers/reservationController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticate, reservationController.getAll);
router.get('/:id', authenticate, reservationController.getById);
router.post('/', reservationController.create);
router.put('/:id', authenticate, reservationController.update);
router.patch('/:id/status', authenticate, reservationController.updateStatus);
router.delete('/:id', authenticate, reservationController.remove);

export default router;
