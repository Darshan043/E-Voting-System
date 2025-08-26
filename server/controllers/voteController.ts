import { Request, Response } from 'express';
import db from '../database/connection.js';
import { Vote } from '../database/models.js';

export class VoteController {
  // Cast a vote
  static castVote(req: Request, res: Response) {
    try {
      const { studentId, candidateId, department, year } = req.body;

      if (!studentId || !candidateId || !department || !year) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Start transaction
      const transaction = db.transaction(() => {
        // Check if student exists and hasn't voted
        const student = db.prepare('SELECT * FROM students WHERE id = ? AND hasVoted = FALSE').get(studentId);
        if (!student) {
          throw new Error('Student not found or has already voted');
        }

        // Check if candidate exists
        const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(candidateId);
        if (!candidate) {
          throw new Error('Candidate not found');
        }

        // Check if voting is enabled
        const settings = db.prepare('SELECT votingEnabled FROM votingSettings WHERE id = 1').get() as { votingEnabled: boolean };
        if (!settings || !settings.votingEnabled) {
          throw new Error('Voting is currently disabled');
        }

        // Insert vote
        const insertVote = db.prepare(`
          INSERT INTO votes (studentId, candidateId, department, year, timestamp)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);
        const voteResult = insertVote.run(studentId, candidateId, department, year);

        // Update candidate vote count
        const updateCandidate = db.prepare(`
          UPDATE candidates 
          SET votes = votes + 1, updatedAt = CURRENT_TIMESTAMP 
          WHERE id = ?
        `);
        updateCandidate.run(candidateId);

        // Mark student as voted
        const updateStudent = db.prepare(`
          UPDATE students 
          SET hasVoted = TRUE, updatedAt = CURRENT_TIMESTAMP 
          WHERE id = ?
        `);
        updateStudent.run(studentId);

        return voteResult.lastInsertRowid;
      });

      const voteId = transaction();
      const newVote = db.prepare('SELECT * FROM votes WHERE id = ?').get(voteId) as Vote;

      res.status(201).json({
        message: 'Vote cast successfully',
        vote: newVote
      });

    } catch (error: any) {
      console.error('Error casting vote:', error);
      
      if (error.message.includes('Student not found')) {
        return res.status(404).json({ error: 'Student not found or has already voted' });
      }
      if (error.message.includes('Candidate not found')) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      if (error.message.includes('Voting is currently disabled')) {
        return res.status(403).json({ error: 'Voting is currently disabled' });
      }
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'Student has already voted' });
      }
      
      res.status(500).json({ error: 'Failed to cast vote' });
    }
  }

  // Get all votes (admin only)
  static getAllVotes(req: Request, res: Response) {
    try {
      const votes = db.prepare(`
        SELECT 
          v.*,
          s.name as studentName,
          c.name as candidateName,
          c.position
        FROM votes v
        JOIN students s ON v.studentId = s.id
        JOIN candidates c ON v.candidateId = c.id
        ORDER BY v.timestamp DESC
      `).all();

      res.json(votes);
    } catch (error) {
      console.error('Error fetching votes:', error);
      res.status(500).json({ error: 'Failed to fetch votes' });
    }
  }

  // Get vote analytics
  static getVoteAnalytics(req: Request, res: Response) {
    try {
      // Total votes
      const totalVotes = db.prepare('SELECT COUNT(*) as count FROM votes').get() as { count: number };
      
      // Votes by department
      const votesByDepartment = db.prepare(`
        SELECT department, COUNT(*) as count
        FROM votes
        GROUP BY department
        ORDER BY count DESC
      `).all();

      // Votes by year
      const votesByYear = db.prepare(`
        SELECT year, COUNT(*) as count
        FROM votes
        GROUP BY year
        ORDER BY year
      `).all();

      // Votes by hour (for timeline)
      const votesByHour = db.prepare(`
        SELECT 
          strftime('%Y-%m-%d %H:00:00', timestamp) as hour,
          COUNT(*) as count
        FROM votes
        GROUP BY hour
        ORDER BY hour
      `).all();

      // Top candidates
      const topCandidates = db.prepare(`
        SELECT 
          c.name,
          c.position,
          c.department,
          COUNT(v.id) as votes,
          ROUND(COUNT(v.id) * 100.0 / (SELECT COUNT(*) FROM votes), 2) as percentage
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidateId
        GROUP BY c.id
        ORDER BY votes DESC
        LIMIT 10
      `).all();

      // Turnout by department
      const turnoutByDepartment = db.prepare(`
        SELECT 
          s.department,
          COUNT(s.id) as totalStudents,
          SUM(CASE WHEN s.hasVoted THEN 1 ELSE 0 END) as votedStudents,
          ROUND(SUM(CASE WHEN s.hasVoted THEN 1 ELSE 0 END) * 100.0 / COUNT(s.id), 2) as turnoutPercentage
        FROM students s
        GROUP BY s.department
        ORDER BY turnoutPercentage DESC
      `).all();

      res.json({
        summary: {
          totalVotes: totalVotes.count,
          totalStudents: db.prepare('SELECT COUNT(*) as count FROM students').get(),
          totalCandidates: db.prepare('SELECT COUNT(*) as count FROM candidates').get(),
          overallTurnout: db.prepare(`
            SELECT ROUND(
              COUNT(CASE WHEN hasVoted THEN 1 END) * 100.0 / COUNT(*), 2
            ) as turnout FROM students
          `).get()
        },
        breakdown: {
          byDepartment: votesByDepartment,
          byYear: votesByYear,
          byHour: votesByHour,
          turnoutByDepartment: turnoutByDepartment
        },
        topCandidates
      });
    } catch (error) {
      console.error('Error fetching vote analytics:', error);
      res.status(500).json({ error: 'Failed to fetch vote analytics' });
    }
  }

  // Get real-time voting data
  static getRealTimeData(req: Request, res: Response) {
    try {
      const recentVotes = db.prepare(`
        SELECT 
          v.timestamp,
          v.department,
          v.year,
          c.name as candidateName,
          c.position
        FROM votes v
        JOIN candidates c ON v.candidateId = c.id
        ORDER BY v.timestamp DESC
        LIMIT 50
      `).all();

      const currentStats = db.prepare(`
        SELECT 
          COUNT(*) as totalVotes,
          COUNT(DISTINCT studentId) as uniqueVoters,
          COUNT(DISTINCT candidateId) as candidatesWithVotes
        FROM votes
      `).get();

      const recentTurnout = db.prepare(`
        SELECT 
          strftime('%Y-%m-%d %H:%M', timestamp) as minute,
          COUNT(*) as votes
        FROM votes
        WHERE timestamp >= datetime('now', '-1 hour')
        GROUP BY minute
        ORDER BY minute DESC
        LIMIT 60
      `).all();

      res.json({
        recentVotes,
        currentStats,
        recentTurnout,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      res.status(500).json({ error: 'Failed to fetch real-time data' });
    }
  }

  // Check if student has voted
  static checkVoteStatus(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      
      const vote = db.prepare(`
        SELECT 
          v.*,
          c.name as candidateName,
          c.position
        FROM votes v
        JOIN candidates c ON v.candidateId = c.id
        WHERE v.studentId = ?
      `).get(studentId);

      if (vote) {
        res.json({ hasVoted: true, vote });
      } else {
        res.json({ hasVoted: false, vote: null });
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
      res.status(500).json({ error: 'Failed to check vote status' });
    }
  }
}