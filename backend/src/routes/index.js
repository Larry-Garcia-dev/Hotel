import { Router } from 'express';
import authRoutes from './authRoutes.js';
import roomTypeRoutes from './roomTypeRoutes.js';
import roomRoutes from './roomRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import guestRoutes from './guestRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/room-types', roomTypeRoutes);
router.use('/rooms', roomRoutes);
router.use('/reservations', reservationRoutes);
router.use('/guests', guestRoutes);
router.use('/inventory', inventoryRoutes);

export default router;
