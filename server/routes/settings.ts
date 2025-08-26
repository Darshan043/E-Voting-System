import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';

const router = Router();

// GET /api/settings - Get current voting settings
router.get('/', SettingsController.getSettings);

// GET /api/settings/stats - Get system statistics
router.get('/stats', SettingsController.getSystemStats);

// GET /api/settings/export - Export data
router.get('/export', SettingsController.exportData);

// PUT /api/settings - Update voting settings
router.put('/', SettingsController.updateSettings);

// POST /api/settings/toggle-voting - Toggle voting status
router.post('/toggle-voting', SettingsController.toggleVoting);

// POST /api/settings/reset - Reset entire system (dangerous)
router.post('/reset', SettingsController.resetSystem);

export default router;