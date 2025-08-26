import { Request, Response } from 'express';
import db from '../database/connection.js';
import { Candidate } from '../database/models.js';

export class CandidateController {
  // Get all candidates
  static getAllCandidates(req: Request, res: Response) {
    try {
      const candidates = db.prepare('SELECT * FROM candidates ORDER BY position, name').all() as Candidate[];
      res.json(candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  // Get candidate by ID
  static getCandidateById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Candidate;
      
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      
      res.json(candidate);
    } catch (error) {
      console.error('Error fetching candidate:', error);
      res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  }

  // Get candidates by position
  static getCandidatesByPosition(req: Request, res: Response) {
    try {
      const { position } = req.params;
      const candidates = db.prepare('SELECT * FROM candidates WHERE position = ? ORDER BY name').all(position) as Candidate[];
      res.json(candidates);
    } catch (error) {
      console.error('Error fetching candidates by position:', error);
      res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  // Add new candidate
  static addCandidate(req: Request, res: Response) {
    try {
      const { name, position, department, year, manifesto } = req.body;

      if (!name || !position || !department || !year || !manifesto) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const insertCandidate = db.prepare(`
        INSERT INTO candidates (name, position, department, year, manifesto, votes, updatedAt)
        VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `);

      const result = insertCandidate.run(name, position, department, year, manifesto);
      const newCandidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(result.lastInsertRowid) as Candidate;
      
      res.status(201).json(newCandidate);
    } catch (error) {
      console.error('Error adding candidate:', error);
      res.status(500).json({ error: 'Failed to add candidate' });
    }
  }

  // Update candidate
  static updateCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, position, department, year, manifesto } = req.body;

      const updateCandidate = db.prepare(`
        UPDATE candidates 
        SET name = COALESCE(?, name),
            position = COALESCE(?, position),
            department = COALESCE(?, department),
            year = COALESCE(?, year),
            manifesto = COALESCE(?, manifesto),
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      const result = updateCandidate.run(name, position, department, year, manifesto, id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      const updatedCandidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as Candidate;
      res.json(updatedCandidate);
    } catch (error) {
      console.error('Error updating candidate:', error);
      res.status(500).json({ error: 'Failed to update candidate' });
    }
  }

  // Delete candidate
  static deleteCandidate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if candidate has votes
      const voteCount = db.prepare('SELECT COUNT(*) as count FROM votes WHERE candidateId = ?').get(id) as { count: number };
      
      if (voteCount.count > 0) {
        return res.status(409).json({ 
          error: 'Cannot delete candidate with existing votes',
          votes: voteCount.count
        });
      }

      const deleteCandidate = db.prepare('DELETE FROM candidates WHERE id = ?');
      const result = deleteCandidate.run(id);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ error: 'Failed to delete candidate' });
    }
  }

  // Get election results
  static getElectionResults(req: Request, res: Response) {
    try {
      const results = db.prepare(`
        SELECT 
          c.*,
          COUNT(v.id) as actualVotes,
          ROUND(
            CASE 
              WHEN (SELECT COUNT(*) FROM votes) > 0 
              THEN (COUNT(v.id) * 100.0 / (SELECT COUNT(*) FROM votes))
              ELSE 0 
            END, 2
          ) as percentage
        FROM candidates c
        LEFT JOIN votes v ON c.id = v.candidateId
        GROUP BY c.id, c.name, c.position, c.department, c.year, c.manifesto, c.votes, c.createdAt, c.updatedAt
        ORDER BY c.position, COUNT(v.id) DESC, c.name
      `).all();

      // Group by position
      const resultsByPosition = results.reduce((acc: any, candidate: any) => {
        if (!acc[candidate.position]) {
          acc[candidate.position] = [];
        }
        acc[candidate.position].push(candidate);
        return acc;
      }, {});

      res.json({
        overall: results,
        byPosition: resultsByPosition,
        summary: {
          totalCandidates: results.length,
          totalVotes: db.prepare('SELECT COUNT(*) as count FROM votes').get() as { count: number },
          positions: Object.keys(resultsByPosition)
        }
      });
    } catch (error) {
      console.error('Error fetching election results:', error);
      res.status(500).json({ error: 'Failed to fetch election results' });
    }
  }

  // Reset candidate votes (admin only)
  static resetCandidateVotes(req: Request, res: Response) {
    try {
      // Reset votes count in candidates table
      db.prepare('UPDATE candidates SET votes = 0, updatedAt = CURRENT_TIMESTAMP').run();
      
      // Delete all vote records
      db.prepare('DELETE FROM votes').run();
      
      // Reset all students hasVoted status
      db.prepare('UPDATE students SET hasVoted = FALSE, updatedAt = CURRENT_TIMESTAMP').run();

      res.json({ message: 'All votes have been reset successfully' });
    } catch (error) {
      console.error('Error resetting votes:', error);
      res.status(500).json({ error: 'Failed to reset votes' });
    }
  }
}