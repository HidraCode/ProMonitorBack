import express from 'express';
import { 
    getAllMonitores, 
    getActiveMonitores, 
    getInactiveMonitores,
    getMonitor, 
    createMonitor,
    updateMonitor
} from "../controllers/monitorController.js";
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getAllMonitores);
router.get('/active', authenticateToken, getActiveMonitores);
router.get('/inactive', getInactiveMonitores);
router.get('/:codigo_monitor', getMonitor);
router.post('/create', createMonitor);
//router.put('/:codigo_monitor', updateMonitor);

export default router;