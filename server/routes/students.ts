import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';

const router = Router();

// GET /api/students - Get all students
router.get('/', StudentController.getAllStudents);

// GET /api/students/stats - Get voting statistics
router.get('/stats', StudentController.getVotingStats);

// GET /api/students/:id - Get student by ID
router.get('/:id', StudentController.getStudentById);

// POST /api/students - Add new student
router.post('/', StudentController.addStudent);

// POST /api/students/authenticate - Authenticate student
router.post('/authenticate', StudentController.authenticateStudent);

// PUT /api/students/:id - Update student
router.put('/:id', StudentController.updateStudent);

// DELETE /api/students/:id - Delete student
router.delete('/:id', StudentController.deleteStudent);

export default router;