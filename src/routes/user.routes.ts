import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { updateProfileSchema } from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', validateRequest(updateProfileSchema), UserController.updateProfile);
router.get('/points', UserController.getPoints);
router.get('/activities', UserController.getActivities);
router.get('/servers', UserController.getServers);
router.get('/raids/active', UserController.getActiveRaids);

export default router;