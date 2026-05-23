import { Router } from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/categories', authenticate, inventoryController.getCategories);
router.post('/categories', authenticate, inventoryController.createCategory);

router.get('/items', authenticate, inventoryController.getItems);
router.get('/items/:id', authenticate, inventoryController.getItemById);
router.post('/items', authenticate, inventoryController.createItem);
router.put('/items/:id', authenticate, inventoryController.updateItem);
router.delete('/items/:id', authenticate, inventoryController.removeItem);

router.post('/items/:id/movements', authenticate, inventoryController.addMovement);
router.get('/items/:id/movements', authenticate, inventoryController.getMovements);

export default router;
