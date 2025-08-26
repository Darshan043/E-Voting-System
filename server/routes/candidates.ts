import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController.js';

const router = Router();

// GET /api/candidates - Get all candidates
router.get('/', CandidateController.getAllCandidates);

// GET /api/candidates/results - Get election results
router.get('/results', CandidateController.getElectionResults);

// GET /api/candidates/position/:position - Get candidates by position
router.get('/position/:position', CandidateController.getCandidatesByPosition);

// GET /api/candidates/:id - Get candidate by ID
router.get('/:id', CandidateController.getCandidateById);

// POST /api/candidates - Add new candidate
router.post('/', CandidateController.addCandidate);

// POST /api/candidates/reset-votes - Reset all votes (admin only)
router.post('/reset-votes', CandidateController.resetCandidateVotes);

// PUT /api/candidates/:id - Update candidate
router.put('/:id', CandidateController.updateCandidate);

// DELETE /api/candidates/:id - Delete candidate
router.delete('/:id', CandidateController.deleteCandidate);

export default router;