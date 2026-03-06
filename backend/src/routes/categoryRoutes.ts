import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

export default router;
