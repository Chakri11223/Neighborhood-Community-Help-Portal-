import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', authorizeRole('Resident'), RequestController.createRequest);

router.get('/', RequestController.getAllRequests);
router.get('/my-requests', RequestController.getMyRequests);
router.get('/:id', RequestController.getRequestById);

router.put('/:id', authorizeRole('Resident'), RequestController.updateRequest);

router.patch('/:id/status', authorizeRole('Helper'), RequestController.updateRequestStatus);

router.delete('/:id', authorizeRole('Resident', 'Admin'), RequestController.deleteRequest);

export default router;
