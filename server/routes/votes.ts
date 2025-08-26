import { Router } from 'express';
import { VoteController } from '../controllers/voteController.js';

const router = Router();

// POST /api/votes - Cast a vote
router.post('/', VoteController.castVote);

// GET /api/votes - Get all votes (admin only)
router.get('/', VoteController.getAllVotes);

// GET /api/votes/analytics - Get vote analytics
router.get('/analytics', VoteController.getVoteAnalytics);

// GET /api/votes/real-time - Get real-time voting data
router.get('/real-time', VoteController.getRealTimeData);

// GET /api/votes/status/:studentId - Check if student has voted
router.get('/status/:studentId', VoteController.checkVoteStatus);

export default router;