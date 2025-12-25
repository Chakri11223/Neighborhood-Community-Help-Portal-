import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

// Residents can create requests
router.post('/', authorizeRole('Resident'), RequestController.createRequest);

// Helpers and Residents can view requests (Resident sees own, Helper sees all/filtered)
router.get('/', RequestController.getAllRequests);
router.get('/my-requests', RequestController.getMyRequests);
router.get('/:id', RequestController.getRequestById);

// Residents can update their own requests
router.put('/:id', authorizeRole('Resident'), RequestController.updateRequest);

// Helpers can update status (accept/complete)
router.patch('/:id/status', authorizeRole('Helper'), RequestController.updateRequestStatus);

// Residents can delete their requests
router.delete('/:id', authorizeRole('Resident', 'Admin'), RequestController.deleteRequest);

export default router;