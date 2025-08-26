import { Request, Response } from 'express';
import db from '../database/connection.js';
import { Student } from '../database/models.js';

export class StudentController {
  // Get all students
  static getAllStudents(req: Request, res: Response) {
    try {
      const students = db.prepare('SELECT * FROM students ORDER BY name').all() as Student[];
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }

  // Get student by ID
  static getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student;
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  }

  // Authenticate student
  static authenticateStudent(req: Request, res: Response) {
    try {
      const { id, name, department, year } = req.body;

      if (!id || !name || !department || !year) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student;
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      if (student.name.toLowerCase() !== name.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (student.department !== department || student.year !== year) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (student.hasVoted) {
        return res.status(409).json({ error: 'Student has already voted' });
      }
      
      res.json({ 
        message: 'Authentication successful', 
        student: {
          id: student.id,
          name: student.name,
          department: student.department,
          year: student.year,
          hasVoted: student.hasVoted
        }
      });
    } catch (error) {
      console.error('Error authenticating student:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  // Add new student
  static addStudent(req: Request, res: Response) {
    try {
      const { id, name, department, year } = req.body;

      if (!id || !name || !department || !year) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const insertStudent = db.prepare(`
        INSERT INTO students (id, name, department, year, hasVoted, updatedAt)
        VALUES (?, ?, ?, ?, FALSE, CURRENT_TIMESTAMP)
      `);

      try {
        insertStudent.run(id, name, department, year);
        const newStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student;
        res.status(201).json(newStudent);
      } catch (dbError: any) {
        if (dbError.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
          return res.status(409).json({ error: 'Student with this ID already exists' });
        }
        throw dbError;
      }
    } catch (error) {
      console.error('Error adding student:', error);
      res.status(500).json({ error: 'Failed to add student' });
    }
  }

  // Update student
  static updateStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, department, year, hasVoted } = req.body;

      const updateStudent = db.prepare(`
        UPDATE students 
        SET name = COALESCE(?, name),
            department = COALESCE(?, department),
            year = COALESCE(?, year),
            hasVoted = COALESCE(?, hasVoted),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = updateStudent.run(name, department, year, hasVoted, id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const updatedStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student;
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ error: 'Failed to update student' });
    }
  }

  // Delete student
  static deleteStudent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleteStudent = db.prepare('DELETE FROM students WHERE id = ?');
      const result = deleteStudent.run(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }

  // Get voting statistics
  static getVotingStats(req: Request, res: Response) {
    try {
      const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
      const votedStudents = db.prepare('SELECT COUNT(*) as count FROM students WHERE hasVoted = TRUE').get() as { count: number };
      const departmentStats = db.prepare(`
        SELECT 
          department,
          COUNT(*) as total,
          SUM(CASE WHEN hasVoted THEN 1 ELSE 0 END) as voted
        FROM students 
        GROUP BY department
      `).all();

      res.json({
        total: totalStudents.count,
        voted: votedStudents.count,
        remaining: totalStudents.count - votedStudents.count,
        turnout: totalStudents.count > 0 ? (votedStudents.count / totalStudents.count) * 100 : 0,
        departmentBreakdown: departmentStats
      });
    } catch (error) {
      console.error('Error fetching voting stats:', error);
      res.status(500).json({ error: 'Failed to fetch voting statistics' });
    }
  }
}